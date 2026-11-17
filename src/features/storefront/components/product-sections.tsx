import type { CatalogProduct } from "@/features/catalog/types";
import { container } from "../styles";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";

function Empty() {
  return <p className="rounded-2xl border border-dashed border-forest/20 py-14 text-center font-display text-xl italic text-ink/55">Koleksi sedang disiapkan.</p>;
}

export function NewArrivals({ products }: { products: CatalogProduct[] }) {
  return (
    <section id="terbaru" className={`${container} py-14`}>
      <SectionHeading eyebrow="Baru mekar" title="Kedatangan" accent="terbaru" href="/koleksi" />
      {products.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}

export function FeaturedCollection({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) return null;
  const [lead, ...rest] = products;
  return (
    <section id="pilihan" className={`${container} py-14`}>
      <SectionHeading eyebrow="Paling dicintai" title="Koleksi" accent="pilihan" href="/koleksi" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 lg:grid-cols-4 lg:grid-rows-2">
        <div className="col-span-2 lg:row-span-2">
          <ProductCard product={lead} variant="large" />
        </div>
        {rest.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}