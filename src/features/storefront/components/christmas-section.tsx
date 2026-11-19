import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHRISTMAS, daysUntilChristmas } from "@/config/christmas";
import type { CatalogProduct } from "@/features/catalog/types";
import { container } from "../styles";
import { Holly, Star } from "./christmas-art";
import { Garland, Ornaments } from "./garland";
import { ProductCard } from "./product-card";
import { PRODUCT_GRID } from "./product-sections";
import { Snow } from "./snow";

const CANDY = { background: "repeating-linear-gradient(135deg, #a3182f 0 14px, #ffffff 14px 28px)" };
const BACKGROUND = {
  background: "radial-gradient(70% 55% at 50% 0%, rgba(212,175,106,0.16), transparent 70%), linear-gradient(180deg, #0f3b2a 0%, #0a2a1e 100%)",
};

/** Menggantikan "Kedatangan terbaru". Tidak tampil jika belum ada produk dengan acara Natal. */
export function ChristmasSection({ products }: { products: CatalogProduct[] }) {
//   if (products.length === 0) return null;

  const days = daysUntilChristmas();
  const countdown = days === 0 ? "Selamat Natal!" : days > 0 && days <= CHRISTMAS.countdownWindowDays ? `${days} hari lagi menuju Natal` : null;

  return (
    <section id="natal" aria-labelledby="natal-heading" className="relative isolate my-12 overflow-hidden text-cream" style={BACKGROUND}>
      <Snow count={28} />
      <Garland />
      <Ornaments />
      <Holly className="pointer-events-none absolute -left-8 bottom-16 w-40 rotate-6 opacity-90 sm:w-56" />
      <Holly className="pointer-events-none absolute -right-8 bottom-24 w-40 -rotate-[160deg] opacity-90 sm:w-56" />

      <div className={`${container} relative pb-14 pt-8 sm:pb-20`}>
        <header className="mb-9 text-center sm:mb-12">
          {countdown && (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-pine-deep/60 px-4 py-1.5 text-xs text-gold-soft sm:text-sm">
              <Star className="size-3.5 text-gold" /> {countdown} <Star className="size-3.5 text-gold" />
            </p>
          )}
          <h2 id="natal-heading" className="font-display text-5xl leading-none sm:text-6xl md:text-7xl">
            Spesial <em className="bg-gradient-to-b from-gold-soft to-gold bg-clip-text italic text-transparent">Natal</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-cream/75 sm:text-base">
            Rangkaian bunga untuk hadiah, meja makan, dan ucapan hangat di hari Natal.
          </p>
        </header>

        <div className={PRODUCT_GRID}>
          {products.map((p) => <ProductCard key={p.id} product={p} size="compact" tone="dark" />)}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={CHRISTMAS.href}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-gold/60 bg-cranberry px-6 text-sm font-medium text-cream shadow-lg shadow-black/25 transition hover:bg-cranberry-deep"
          >
            Lihat semua produk Natal <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div aria-hidden className="h-1.5 w-full" style={CANDY} />
    </section>
  );
}