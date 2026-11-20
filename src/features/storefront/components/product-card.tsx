"use client";
import Link from "next/link";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { ProductImage } from "@/components/shared/product-image";
import type { CatalogProduct } from "@/features/catalog/types";
import { useCart } from "@/features/cart/cart-provider";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: CatalogProduct;
  size?: "default" | "compact";
  tone?: "light" | "dark" | "mono";
};

export function ProductCard({
  product,
  size = "default",
  tone = "light",
}: ProductCardProps) {
  const { add } = useCart();
  const compact = size === "compact";
  const dark = tone === "dark";
  const mono = tone === "mono";

  const handleAdd = () => {
    const cart = add({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
    });
    toast.success(`${product.name} masuk keranjang`, {
      description: `Total keranjang ${formatRupiah(cart.total)} (termasuk PPN ${cart.ppnRate}%)`,
    });
  };

  return (
    <article className="group flex h-full flex-col">
      <div
        className={cn(
          "relative overflow-hidden bg-cream-deep",
          compact
            ? "aspect-[5/6] rounded-xl sm:rounded-2xl"
            : "aspect-[4/5] rounded-2xl sm:rounded-[1.5rem]",
          dark && "ring-1 ring-gold/40",
        )}
      >
        <Link
          href={`/produk/${product.slug}`}
          aria-label={`Lihat ${product.name}`}
          className="absolute inset-0 block"
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            sizes="(min-width:1280px) 20vw, (min-width:768px) 25vw, 50vw"
            className="absolute inset-0"
          />
        </Link>

        {product.badge && (
          <span
            className={cn(
              "absolute rounded-full bg-cream/95 font-medium text-forest",
              compact
                ? "left-2 top-2 px-2 py-0.5 text-[10px] sm:text-[11px]"
                : "left-2 top-2 px-2.5 py-0.5 text-[11px] sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs",
            )}
          >
            {product.badge}
          </span>
        )}

        {product.soldOut ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/45 font-display text-base italic text-cream sm:text-xl">
            Sold out
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className={cn(
              "absolute grid place-items-center rounded-full shadow-md transition hover:scale-105 active:scale-95",
              "after:absolute after:-inset-1.5 after:content-['']", // area sentuh lebih luas tanpa membesarkan tombol
              compact
                ? "bottom-1.5 right-1.5 size-8 sm:bottom-2 sm:right-2 sm:size-9"
                : "bottom-2 right-2 size-9 sm:bottom-3 sm:right-3 sm:size-10 lg:size-11",
              dark
                ? "bg-gold text-pine hover:bg-gold-soft"
                : mono
                  ? "bg-black text-white hover:bg-black/80"
                  : "bg-forest text-cream hover:bg-forest-deep",
            )}
          >
            <Plus
              className={compact ? "size-4" : "size-4 sm:size-[18px] lg:size-5"}
            />
          </button>
        )}
      </div>

      <div className={compact ? "pt-2" : "pt-2.5 sm:pt-3"}>
        {product.categoryName && !compact && (
          <p
            className={cn(
              "text-[11px] sm:text-xs",
              dark ? "text-cream/55" : "text-ink/50",
            )}
          >
            {product.categoryName}
          </p>
        )}
        <h3
          className={cn(
            "font-display leading-snug",
            compact
              ? "text-[15px] sm:text-base"
              : "text-base sm:text-lg lg:text-xl",
            dark && "text-cream",
          )}
        >
          {product.name}
        </h3>
        <p
          className={cn(
            compact ? "text-[13px]" : "text-sm",
            "mt-0.5",
            dark ? "text-gold" : mono ? "text-black" : "text-forest",
          )}
        >
          {formatRupiah(product.price)}
        </p>
      </div>
    </article>
  );
}
