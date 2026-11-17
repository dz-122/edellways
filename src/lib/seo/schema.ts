import { SITE, absoluteUrl } from "@/config/site";
import type { ProductDetail } from "@/features/catalog/types";
import { INFO } from "@/features/storefront/content";

type Json = Record<string, unknown>;

const phone = () => {
  const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  return digits ? `+${digits}` : undefined;
};

export function buildFloristSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Florist",
    "@id": absoluteUrl("/#business"),
    name: SITE.name,
    url: absoluteUrl("/"),
    image: absoluteUrl(SITE.defaultOgImage),
    telephone: phone(),
    priceRange: SITE.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.streetAddress,
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      postalCode: SITE.postalCode || undefined,
      addressCountry: SITE.country,
    },
    geo: SITE.geo ? { "@type": "GeoCoordinates", ...SITE.geo } : undefined,
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: SITE.hours.days, opens: SITE.hours.opens, closes: SITE.hours.closes },
    ],
    areaServed: { "@type": "City", name: SITE.city },
    sameAs: [INFO.instagramUrl],
  };
}

export const buildWebsiteSchema = (): Json => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: absoluteUrl("/"),
  inLanguage: "id-ID",
});

export const buildBreadcrumbSchema = (items: { name: string; path: string }[]): Json => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
});

export function buildProductSchema(p: ProductDetail): Json {
  const url = absoluteUrl(`/produk/${p.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description || undefined,
    image: p.image ? [p.image] : undefined,
    url,
    category: p.categoryName ?? undefined,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "IDR",
      price: p.price,
      availability: p.soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE.name },
    },
  };
}