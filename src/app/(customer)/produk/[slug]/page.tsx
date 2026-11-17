import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { MessageCircle, Truck } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { ProductImage } from "@/components/shared/product-image";
import { SITE } from "@/config/site";
import { AddToCartPanel } from "@/features/catalog/components/add-to-cart-panel";
import { getProductDetail } from "@/features/catalog/queries";
import { Breadcrumb } from "@/features/storefront/components/breadcrumb";
import { ProductCard } from "@/features/storefront/components/product-card";
import { SectionHeading } from "@/features/storefront/components/section-heading";
import { INFO } from "@/features/storefront/content";
import { container } from "@/features/storefront/styles";
import { formatRupiah } from "@/lib/format";
import { buildBreadcrumbSchema, buildProductSchema } from "@/lib/seo/schema";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductDetail(slug);
  if (!data) return { title: "Produk tidak ditemukan", robots: { index: false } };
  const { product } = data;
  const title = `${product.name} - Bunga ${SITE.city}`;
  const description = (product.description || `${product.name} dari ${SITE.name}, toko bunga di ${SITE.city}, ${SITE.region}. Harga ${formatRupiah(product.price)}. Pesan lewat WhatsApp.`).slice(0, 158);
  const path = `/produk/${product.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", images: product.image ? [product.image] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug: key } = await params;
  const data = await getProductDetail(key);
  if (!data) notFound();
  const { product, related } = data;

  // URL lama berbentuk ID dialihkan permanen ke URL slug.
  if (product.slug !== key) permanentRedirect(`/produk/${product.slug}`);

  const schema = [
    buildProductSchema(product),
    buildBreadcrumbSchema([
      { name: "Beranda", path: "/" },
      { name: "Koleksi", path: "/koleksi" },
      ...(product.categorySlug && product.categoryName ? [{ name: product.categoryName, path: `/koleksi?koleksi=${product.categorySlug}` }] : []),
      { name: product.name, path: `/produk/${product.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schema} />

      <div className={`${container} py-8`}>
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Koleksi", href: "/koleksi" },
            ...(product.categorySlug && product.categoryName ? [{ label: product.categoryName, href: `/koleksi?koleksi=${product.categorySlug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream-deep lg:sticky lg:top-24 lg:self-start">
            <ProductImage src={product.image} alt={`${product.name} - bunga ${SITE.city}`} priority sizes="(min-width:1024px) 600px, 100vw" className="absolute inset-0" />
            {product.badge && <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-4 py-1.5 text-sm font-medium text-forest">{product.badge}</span>}
            {product.soldOut && <div className="absolute inset-0 grid place-items-center bg-ink/45 font-display text-3xl italic text-cream">Sold out</div>}
          </div>

          <div className="lg:pt-6">
            {product.categoryName && product.categorySlug && (
              <Link href={`/koleksi?koleksi=${product.categorySlug}`} className="font-display text-lg italic text-rose hover:underline">
                {product.categoryName}
              </Link>
            )}
            <h1 className="mt-1 font-display text-5xl leading-[1.05] md:text-6xl">{product.name}</h1>
            <p className="mt-4 font-display text-3xl text-forest">{formatRupiah(product.price)}</p>

            <p className="mt-4 flex items-center gap-2 text-sm">
              <span className={`size-2 rounded-full ${product.soldOut ? "bg-rose" : "bg-emerald-600"}`} />
              {product.soldOut ? "Sedang sold out" : "Tersedia"}
            </p>

            {product.description && <p className="mt-6 whitespace-pre-line leading-relaxed text-ink/75">{product.description}</p>}

            {product.occasions.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm text-ink/60">Cocok untuk</p>
                <ul className="flex flex-wrap gap-2">
                  {product.occasions.map((o) => (
                    <li key={o.slug}>
                      <Link href={`/koleksi?acara=${o.slug}`} className="inline-block rounded-full bg-blush/60 px-4 py-1.5 text-sm text-forest transition hover:bg-blush">
                        {o.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 border-t border-forest/15 pt-8">
              <AddToCartPanel product={product} />
            </div>

            <ul className="mt-8 space-y-4 rounded-[1.5rem] bg-blush/40 p-5 text-sm text-ink/75">
              <li className="flex gap-3"><Truck className="mt-0.5 size-4 shrink-0 text-forest" />{INFO.delivery}</li>
              <li className="flex gap-3"><MessageCircle className="mt-0.5 size-4 shrink-0 text-forest" />Ingin kartu ucapan atau request khusus? Sampaikan lewat WhatsApp saat checkout.</li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={`${container} py-16`}>
          <SectionHeading eyebrow="Pilihan lain" title="Mungkin kamu" accent="suka" href="/koleksi" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
}