"use server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { CartItem } from "./types";

const linesSchema = z
  .array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(99) }))
  .max(50);

export type CartValidation = { items: CartItem[]; unavailable: string[] };

/** Harga & status selalu diambil ulang dari database sebelum pesan dikirim ke WhatsApp. */
export async function validateCart(lines: { productId: string; quantity: number }[]): Promise<CartValidation> {
  const parsed = linesSchema.safeParse(lines);
  if (!parsed.success) return { items: [], unavailable: ["Keranjang tidak valid."] };

  const products = await prisma.product.findMany({
    where: { id: { in: parsed.data.map((l) => l.productId) } },
    select: { id: true, name: true, price: true, image: true, isActive: true, soldOut: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const items: CartItem[] = [];
  const unavailable = new Set<string>();
  for (const line of parsed.data) {
    const p = byId.get(line.productId);
    if (!p || !p.isActive) unavailable.add("Ada produk yang sudah tidak tersedia.");
    else if (p.soldOut) unavailable.add(`${p.name} sedang sold out.`);
    else items.push({ productId: p.id, name: p.name, image: p.image, price: p.price, quantity: line.quantity });
  }
  return { items, unavailable: [...unavailable] };
}