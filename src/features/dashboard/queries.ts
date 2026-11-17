import "server-only";
import { prisma } from "@/lib/prisma";
import { toDateKey } from "@/lib/format";
import { toTransactionView } from "@/features/transactions/serializers";
import type { TransactionView } from "@/features/transactions/types";

export type SalesPoint = { label: string; total: number };

export type DashboardData = {
  totalSales: number;
  transactionCount: number;
  activeProducts: number;
  soldOutProducts: number;
  todaySales: number;
  chart: SalesPoint[];
  recent: TransactionView[];
};

const DAY_MS = 86_400_000;
const CHART_DAYS = 14;

export async function getDashboardData(): Promise<DashboardData> {
  const live = { deletedAt: null }; // transaksi yang diarsipkan tidak dihitung
  const since = new Date(Date.now() - CHART_DAYS * DAY_MS);

  const [aggregate, activeProducts, soldOutProducts, recent, lastDays] = await Promise.all([
    prisma.transaction.aggregate({ where: live, _sum: { total: true }, _count: true }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, soldOut: true } }),
    prisma.transaction.findMany({ where: live, orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    prisma.transaction.findMany({ where: { ...live, createdAt: { gte: since } }, select: { createdAt: true, total: true } }),
  ]);

  const totalByDay = new Map<string, number>();
  for (const t of lastDays) {
    const key = toDateKey(t.createdAt);
    totalByDay.set(key, (totalByDay.get(key) ?? 0) + t.total);
  }

  const labelFormat = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
  const chart: SalesPoint[] = Array.from({ length: CHART_DAYS }, (_, i) => {
    const date = new Date(Date.now() - (CHART_DAYS - 1 - i) * DAY_MS);
    return { label: labelFormat.format(date), total: totalByDay.get(toDateKey(date)) ?? 0 };
  });

  return {
    totalSales: aggregate._sum.total ?? 0,
    transactionCount: aggregate._count,
    activeProducts,
    soldOutProducts,
    todaySales: totalByDay.get(toDateKey(new Date())) ?? 0,
    chart,
    recent: recent.map(toTransactionView),
  };
}
