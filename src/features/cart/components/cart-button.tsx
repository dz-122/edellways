"use client";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../cart-provider";

export function CartButton() {
  const { count, ready, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Buka keranjang${ready && count ? `, ${count} produk` : ""}`}
      className="relative grid size-10 place-items-center rounded-full text-forest transition hover:bg-forest/10"
    >
      <ShoppingBag className="size-5" />
      {ready && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-rose px-1 text-[11px] font-medium leading-5 text-white">
          {count}
        </span>
      )}
    </button>
  );
}