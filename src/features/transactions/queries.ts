import "server-only";
import type { Prisma } from "@prisma/client";
import { STORE } from "@/config/store";
import { prisma } from "@/lib/prisma";
import { toTransactionView } from "./serializers";
import { EXPORT_MAX_ROWS, HISTORY_PAGE_SIZE } from "./constants";
import type { HistoryFilters, HistoryPage, ProductOption, TransactionView } from "./types";

export async function getSellableProducts(): Promise<ProductOption[]> {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, price: true, image: true, soldOut: true },
  });
}

export async function getTransactionById(id: string): Promise<TransactionView | null> {
  const tx = await prisma.transaction.findUnique({ where: { id }, include: { items: true } });
  return tx ? toTransactionView(tx) : null;
}

function buildWhere(filters: HistoryFilters): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = {};

  if (filters.status === "active") where.deletedAt = null;
  if (filters.status === "archived") where.deletedAt = { not: null };

  if (filters.q) {
    const contains = { contains: filters.q, mode: "insensitive" as const };
    where.OR = [
      { cashierName: contains },
      { customerName: contains },
      { transactionNumber: contains },
      { items: { some: { productName: contains } } },
    ];
  }
  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from && { gte: new Date(`${filters.from}T00:00:00${STORE.utcOffset}`) }),
      ...(filters.to && { lte: new Date(`${filters.to}T23:59:59.999${STORE.utcOffset}`) }),
    };
  }
  if (filters.cashier) where.cashierName = filters.cashier;
  if (filters.method) where.paymentMethod = filters.method;
  return where;
}

export async function getTransactionPage(filters: HistoryFilters, requestedPage: number): Promise<HistoryPage> {
  const where = buildWhere(filters);
  const aggregate = await prisma.transaction.aggregate({ where, _count: true, _sum: { total: true } });

  const totalCount = aggregate._count;
  const pageCount = Math.max(1, Math.ceil(totalCount / HISTORY_PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);

  const rows = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * HISTORY_PAGE_SIZE,
    take: HISTORY_PAGE_SIZE,
    include: { items: true },
  });
  return { rows: rows.map(toTransactionView), page, pageCount, totalCount, totalSales: aggregate._sum.total ?? 0 };
}

export async function getTransactionsForExport(filters: HistoryFilters): Promise<TransactionView[]> {
  const rows = await prisma.transaction.findMany({
    where: buildWhere(filters),
    orderBy: { createdAt: "asc" },
    take: EXPORT_MAX_ROWS,
    include: { items: true },
  });
  return rows.map(toTransactionView);
}

export async function getCashierNames(): Promise<string[]> {
  const rows = await prisma.transaction.findMany({ distinct: ["cashierName"], select: { cashierName: true }, orderBy: { cashierName: "asc" } });
  return rows.map((r) => r.cashierName);
}
