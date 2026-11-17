import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { DEFAULT_FILTERS, buildCatalogHref } from "./filters";
import type { CatalogFilters, CatalogTaxonomy } from "./types";

function resolveSelection(filters: CatalogFilters, taxonomy: CatalogTaxonomy) {
  return {
    collection: taxonomy.collections.find((c) => c.slug === filters.collection) ?? null,
    occasion: taxonomy.occasions.find((o) => o.slug === filters.occasion) ?? null,
  };
}

export function catalogHeading(filters: CatalogFilters, taxonomy: CatalogTaxonomy): string {
  const { collection, occasion } = resolveSelection(filters, taxonomy);
  if (filters.q) return `Hasil untuk “${filters.q}”`;
  if (collection && occasion) return `${collection.name} untuk ${occasion.name}`;
  if (occasion) return `Bunga ${occasion.name}`;
  if (collection) return collection.name;
  return "Koleksi";
}

/**
 * Diindeks: /koleksi polos, atau tepat SATU filter (koleksi ATAU acara) tanpa parameter lain.
 * Variasi lain (cari, urut, tersedia, halaman 2+, kombinasi) -> noindex dan canonical ke halaman dasarnya.
 */
export function buildCatalogMetadata(filters: CatalogFilters, taxonomy: CatalogTaxonomy, page: number): Metadata {
  const { collection, occasion } = resolveSelection(filters, taxonomy);
  const hasUnknown = Boolean((filters.collection && !collection) || (filters.occasion && !occasion));
  const single = Boolean(collection) !== Boolean(occasion);

  const canonical = buildCatalogHref({
    ...DEFAULT_FILTERS,
    collection: single && collection ? collection.slug : "",
    occasion: single && occasion ? occasion.slug : "",
  });
  const isVariant = Boolean(filters.q) || filters.sort !== "terbaru" || filters.availableOnly || page > 1 || Boolean(collection && occasion) || hasUnknown;

  const title =
    occasion && !collection ? `Bunga ${occasion.name} ${SITE.city}` : collection && !occasion ? `${collection.name} | Koleksi Bunga ${SITE.city}` : `Koleksi Bunga ${SITE.city}`;
  const description = `Buket dan rangkaian bunga ${SITE.name} di ${SITE.city}, ${SITE.region}${occasion && !collection ? ` untuk ${occasion.name.toLowerCase()}` : ""}. Pesan lewat WhatsApp.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
    robots: isVariant ? { index: false, follow: true } : undefined,
  };
}