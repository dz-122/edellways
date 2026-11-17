"use server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fail, succeed, type ActionResult } from "@/lib/action-result";
import { toDateKey } from "@/lib/format";
import { requireSession } from "@/features/auth/session";
import { calculateOrder, settlePayment } from "./calculations";
import { createTransactionSchema, type CreateTransactionInput } from "./schemas";
import { toTransactionView } from "./serializers";
import type { TransactionView } from "./types";

const refresh = () => revalidatePath("/admin/dashboard", "layout");

/**
 * Semua angka dihitung ulang di server: harga & status produk diambil dari database,
 * bukan dari data yang dikirim browser.
 */
export async function createTransaction(input: CreateTransactionInput): Promise<ActionResult<TransactionView>> {
  const session = await requireSession();

  const parsed = createTransactionSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const data = parsed.data;

  const productIds = [...new Set(data.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productById = new Map(products.map((p) => [p.id, p]));

  const lines: Prisma.TransactionItemCreateWithoutTransactionInput[] = [];
  for (const item of data.items) {
    const product = productById.get(item.productId);
    if (!product || !product.isActive) return fail("Ada produk yang tidak ditemukan atau sudah nonaktif.");
    if (product.soldOut) return fail(`${product.name} sedang sold out.`);
    lines.push({
      product: { connect: { id: product.id } },
      productName: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      note: item.note,
      subtotal: product.price * item.quantity,
    });
  }

  const order = calculateOrder(lines.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity })));
  const payment = settlePayment(order.total, data.paymentMethod, data.amountReceived);
  if (!payment) return fail("Uang diterima kurang dari total bayar.");

  const prefix = `EDW-${toDateKey(new Date()).replaceAll("-", "")}-`;

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const tx = await prisma.$transaction(async (db) => {
        const count = await db.transaction.count({ where: { transactionNumber: { startsWith: prefix } } });
        return db.transaction.create({
          data: {
            transactionNumber: prefix + String(count + 1 + attempt).padStart(4, "0"),
            cashier: { connect: { id: session.id } },
            cashierName: data.cashierName,
            customerName: data.customerName,
            paymentMethod: data.paymentMethod,
            ...order,
            ...payment,
            items: { create: lines },
          },
          include: { items: true },
        });
      });
      refresh();
      return succeed(toTransactionView(tx));
    } catch (e) {
      const isDuplicate = e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
      if (!isDuplicate) throw e; // nomor bentrok -> coba lagi
    }
  }
  return fail("Gagal membuat nomor transaksi. Coba simpan lagi.");
}

export async function archiveTransaction(id: string): Promise<ActionResult> {
  await requireSession();
  await prisma.transaction.update({ where: { id }, data: { deletedAt: new Date() } });
  refresh();
  return succeed(undefined);
}

export async function restoreTransaction(id: string): Promise<ActionResult> {
  await requireSession();
  await prisma.transaction.update({ where: { id }, data: { deletedAt: null } });
  refresh();
  return succeed(undefined);
}
