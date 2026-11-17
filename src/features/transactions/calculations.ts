import { PPN_RATE, type PaymentMethod } from "./constants";

type CalcLine = { unitPrice: number; quantity: number };

export type OrderTotals = { subtotal: number; ppnRate: number; ppnAmount: number; total: number };
export type PaymentResult = { amountReceived: number; changeAmount: number };

/** Dipakai server (sumber kebenaran) dan client (hanya tampilan). */
export function calculateOrder(lines: CalcLine[]): OrderTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const ppnAmount = Math.round((subtotal * PPN_RATE) / 100);
  return { subtotal, ppnRate: PPN_RATE, ppnAmount, total: subtotal + ppnAmount };
}

/** Mengembalikan null jika uang tunai yang diterima kurang dari total. */
export function settlePayment(total: number, method: PaymentMethod, received: number): PaymentResult | null {
  if (method === "NON_CASH") return { amountReceived: total, changeAmount: 0 };
  if (!Number.isInteger(received) || received < total) return null;
  return { amountReceived: received, changeAmount: received - total };
}
