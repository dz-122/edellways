import type { CatalogProduct } from "@/features/catalog/types";
import { container } from "../styles";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";

/** Grid kartu kecil untuk beranda: 2 kolom (HP), 3, 4, lalu 5 kolom di desktop. */
export const PRODUCT_GRID = "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 xl:grid-cols-5";

export function FeaturedCollection({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) return null;
  return (
    <section id="pilihan" className={`${container} py-12`}>
      <SectionHeading eyebrow="Paling dicintai" title="Koleksi" accent="pilihan" href="/koleksi" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-4">
        {products.map((p) => <ProductCard key={p.id} product={p} size="compact" />)}
      </div>
    </section>
  );
}