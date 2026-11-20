import { calculateOrder } from "@/features/transactions/calculations";
import { formatRupiah } from "@/lib/format";
import type { CartItem } from "./types";

export const NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export const hasWhatsAppNumber = () => NUMBER.length > 0;

export const buildChatUrl = (message = "") => `https://wa.me/${NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export function buildOrderMessage(items: CartItem[]): string {
  const lines = items.map(
    (item, i) => `${i + 1}. ${item.name}\n   ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}`
  );
  const { subtotal, ppnRate, ppnAmount, total } = calculateOrder(items.map((i) => ({ unitPrice: i.price, quantity: i.quantity })));
  return [
    "Halo Edellways, saya ingin memesan:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatRupiah(subtotal)}`,
    `PPN (${ppnRate}%): ${formatRupiah(ppnAmount)}`,
    `Estimasi total: ${formatRupiah(total)}`,
    "(belum termasuk ongkir)",
    "",
    "Mohon konfirmasi ketersediaan dan total pembayarannya. Terima kasih!",
  ].join("\n");
}

export const buildOrderUrl = (items: CartItem[]) => buildChatUrl(buildOrderMessage(items));