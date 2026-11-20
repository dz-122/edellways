import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHRISTMAS } from "@/config/season";
import type { CatalogProduct } from "@/features/catalog/types";
import { container } from "../styles";
import { Holly, Star } from "./christmas-art";
import { ProductCard } from "./product-card";
import { PRODUCT_GRID } from "./product-sections";
import { Snow } from "./snow";

const STRIPE = { background: "repeating-linear-gradient(135deg, #a3182f 0 14px, #ffffff 14px 28px)" };

export function ChristmasSection({ products }: { products: CatalogProduct[] }) {
  return (
    <section id="natal" aria-labelledby="natal-heading" className="relative isolate my-10 overflow-hidden bg-gradient-to-b from-pine to-pine-deep text-cream">
      <div aria-hidden className="h-1.5 w-full" style={STRIPE} />
      <Snow count={26} />
      <Holly className="pointer-events-none absolute -left-6 top-10 w-40 rotate-6 opacity-90 sm:w-56" />
      <Holly className="pointer-events-none absolute -right-8 bottom-12 w-40 -rotate-[160deg] opacity-90 sm:w-56" />

      <div className={`${container} relative py-12 sm:py-16`}>
        <header className="mb-8 text-center sm:mb-10">
          <p className="flex items-center justify-center gap-2 font-display text-lg italic text-gold">
            <Star className="size-4" /> Natal {new Date().getFullYear()} <Star className="size-4" />
          </p>
          <h2 id="natal-heading" className="mt-2 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
            Spesial <em className="italic text-gold">Natal</em>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-cream/75 sm:text-base">
            Rangkaian spesial bertema Natal untuk hadiah, meja makan, dan ucapan hangat.
          </p>
        </header>

                {products.length === 0 ? (
          <p className="mx-auto max-w-sm rounded-2xl border border-dashed border-gold/40 px-6 py-10 text-center font-display text-xl italic text-cream/80">
            Koleksi Natal segera hadir.
          </p>
        ) : (
          <div className={PRODUCT_GRID}>
            {products.map((p) => <ProductCard key={p.id} product={p} size="compact" tone="dark" />)}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href={CHRISTMAS.href} className="inline-flex h-11 items-center gap-2 rounded-full bg-cranberry px-6 text-sm font-medium text-cream shadow-lg shadow-black/20 transition hover:bg-cranberry-deep">
            Lihat semua produk Natal <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div aria-hidden className="h-1.5 w-full" style={STRIPE} />
    </section>
  );
}