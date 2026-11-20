import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import type { CatalogProduct } from "@/features/catalog/types";
import { container } from "../styles";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";

export const PRODUCT_GRID = "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 xl:grid-cols-5";

export function FeaturedCollection({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) return null;
  return (
    <section id="pilihan" className="bg-white">
      <div className={`${container} py-16 md:py-20`}>
        <SectionHeading eyebrow="Favorit banyak orang" title="Koleksi" accent="pilihan" href="/koleksi" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 90} className="h-full">
              <ProductCard product={p} size="compact" />
            </Reveal>
          ))}
        </div>

        {/* Hanya di HP */}
        <Reveal className="mt-8 sm:hidden">
          <Link
            href="/koleksi"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-forest/30 px-6 text-sm font-medium text-forest transition hover:bg-forest hover:text-cream"
          >
            Lihat semua koleksi <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}