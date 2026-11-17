import { formatRupiah } from "@/lib/format";
import type { CartItem } from "./types";

const NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export const hasWhatsAppNumber = () => NUMBER.length > 0;

export const buildChatUrl = (message = "") => `https://wa.me/${NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export function buildOrderMessage(items: CartItem[]): string {
  const lines = items.map(
    (item, i) => `${i + 1}. ${item.name}\n   ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}`
  );
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return [
    "Halo Edellways, saya ingin memesan:",
    "",
    ...lines,
    "",
    `Estimasi subtotal: ${formatRupiah(subtotal)}`,
    "(belum termasuk PPN dan ongkir)",
    "",
    "Mohon konfirmasi ketersediaan dan total pembayarannya. Terima kasih!",
  ].join("\n");
}

export const buildOrderUrl = (items: CartItem[]) => buildChatUrl(buildOrderMessage(items));