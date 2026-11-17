import type { Prisma } from "@prisma/client";
import type { TransactionView } from "./types";

export type TransactionWithItems = Prisma.TransactionGetPayload<{ include: { items: true } }>;

export function toTransactionView(tx: TransactionWithItems): TransactionView {
  return {
    id: tx.id,
    transactionNumber: tx.transactionNumber,
    cashierName: tx.cashierName,
    customerName: tx.customerName,
    paymentMethod: tx.paymentMethod,
    subtotal: tx.subtotal,
    ppnRate: tx.ppnRate,
    ppnAmount: tx.ppnAmount,
    total: tx.total,
    amountReceived: tx.amountReceived,
    changeAmount: tx.changeAmount,
    createdAt: tx.createdAt.toISOString(),
    deletedAt: tx.deletedAt?.toISOString() ?? null,
    items: tx.items.map((i) => ({
      id: i.id,
      productName: i.productName,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      note: i.note,
      subtotal: i.subtotal,
    })),
  };
}
