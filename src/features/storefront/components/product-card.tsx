"use client";
import Link from "next/link";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { ProductImage } from "@/components/shared/product-image";
import type { CatalogProduct } from "@/features/catalog/types";
import { useCart } from "@/features/cart/cart-provider";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProductCardProps = { product: CatalogProduct; variant?: "default" | "large" };

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { add } = useCart();
  const large = variant === "large";

  const handleAdd = () => {
    add({ productId: product.id, name: product.name, image: product.image, price: product.price });
    toast.success(`${product.name} masuk keranjang`);
  };

  return (
    <article className="group flex h-full flex-col">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-cream-deep sm:rounded-[1.5rem]",
          large ? "aspect-[4/5] lg:aspect-auto lg:min-h-[28rem] lg:flex-1" : "aspect-[4/5]"
        )}
      >
        <Link href={`/produk/${product.slug}`} aria-label={`Lihat ${product.name}`} className="absolute inset-0 block">
          <ProductImage
            src={product.image}
            alt={product.name}
            sizes={large ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"}
            className="absolute inset-0"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-cream/95 px-2.5 py-0.5 text-[11px] font-medium text-forest sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
            {product.badge}
          </span>
        )}

        {product.soldOut ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/45 font-display text-base italic text-cream sm:text-xl">Sold out</div>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className={cn(
              "absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-forest text-cream shadow-md transition",
              "hover:scale-105 hover:bg-forest-deep active:scale-95 sm:bottom-3 sm:right-3 sm:size-10 lg:size-11",
              "after:absolute after:-inset-1.5 after:content-['']" // area sentuh lebih luas tanpa membesarkan tombol
            )}
          >
            <Plus className="size-4 sm:size-[18px] lg:size-5" />
          </button>
        )}
      </div>

      <div className="pt-2.5 sm:pt-3">
        {product.categoryName && <p className="text-[11px] text-ink/50 sm:text-xs">{product.categoryName}</p>}
        <h3 className="font-display text-base leading-snug sm:text-lg lg:text-xl">{product.name}</h3>
        <p className="mt-0.5 text-sm text-forest">{formatRupiah(product.price)}</p>
      </div>
    </article>
  );
}