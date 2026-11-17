"use client";
import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/cart-provider";
import { buildChatUrl } from "@/features/cart/whatsapp";
import { formatRupiah } from "@/lib/format";
import type { CatalogProduct } from "../types";

const MAX_QTY = 99;

export function AddToCartPanel({ product }: { product: CatalogProduct }) {
  const { add, setOpen } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (product.soldOut) {
    return (
      <div className="space-y-3">
        <button type="button" disabled className="h-12 w-full rounded-full bg-ink/15 text-ink/50">Sold out</button>
        <a
          href={buildChatUrl(`Halo Edellways, kapan ${product.name} tersedia lagi?`)}
          className="inline-flex items-center gap-2 text-sm text-forest underline-offset-4 hover:underline"
        >
          <MessageCircle className="size-4" /> Tanya kapan tersedia lagi
        </a>
      </div>
    );
  }

  const item = { productId: product.id, name: product.name, image: product.image, price: product.price };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="inline-flex items-center rounded-full border border-forest/25">
          <button type="button" aria-label="Kurangi jumlah" disabled={quantity <= 1} className="grid size-11 place-items-center disabled:opacity-40" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center tabular-nums" aria-live="polite">{quantity}</span>
          <button type="button" aria-label="Tambah jumlah" disabled={quantity >= MAX_QTY} className="grid size-11 place-items-center disabled:opacity-40" onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}>
            <Plus className="size-4" />
          </button>
        </div>
        <p className="text-sm text-ink/65">Subtotal <span className="font-display text-xl text-ink">{formatRupiah(product.price * quantity)}</span></p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => { add(item, quantity); toast.success(`${product.name} masuk keranjang`); }}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-forest px-6 font-medium text-cream transition hover:bg-forest-deep"
        >
          <ShoppingBag className="size-4" /> Tambah ke keranjang
        </button>
        <button
          type="button"
          onClick={() => { add(item, quantity); setOpen(true); }}
          className="inline-flex h-12 items-center justify-center rounded-full border border-forest/30 px-6 font-medium text-forest transition hover:bg-forest/5"
        >
          Beli sekarang
        </button>
      </div>
    </div>
  );
}