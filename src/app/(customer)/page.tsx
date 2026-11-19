import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE } from "@/config/site";
import { getHomeData } from "@/features/catalog/queries";
import { BrandStory } from "@/features/storefront/components/brand-story";
import { ChristmasSection } from "@/features/storefront/components/christmas-section";
import { Faq } from "@/features/storefront/components/faq";
import { Hero } from "@/features/storefront/components/hero";
import { HowToOrder } from "@/features/storefront/components/how-to-order";
import { LocalIntro } from "@/features/storefront/components/local-intro";
import { Occasions } from "@/features/storefront/components/occasions";
import { PerksMarquee } from "@/features/storefront/components/perks-marquee";
import { FeaturedCollection } from "@/features/storefront/components/product-sections";
import { StoreInfo } from "@/features/storefront/components/store-info";
import { StoreMap } from "@/features/storefront/components/store-map";
import { Testimonials } from "@/features/storefront/components/testimonials";
import { container } from "@/features/storefront/styles";
import { buildFloristSchema, buildWebsiteSchema } from "@/lib/seo/schema";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: `Toko Bunga ${SITE.city} | ${SITE.name}: Buket & Rangkaian Bunga`,
  },
  description: `${SITE.name}, toko bunga di ${SITE.city} (${SITE.region}). Buket wisuda, wedding, ulang tahun, dan rangkaian bunga buatan tangan. Pesan lewat WhatsApp.`,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const { collections, occasions, newArrivals, featured, christmas } =
    await getHomeData();
  const heroProduct = newArrivals.find((p) => p.image) ?? null; // hanya untuk gambar hero

  return (
    <>
      <JsonLd data={[buildFloristSchema(), buildWebsiteSchema()]} />
        <Hero
          image={heroProduct?.image ?? null}
          productName={heroProduct?.name ?? null}
        />
      <PerksMarquee />
      <Occasions occasions={occasions} />
      <ChristmasSection products={christmas} />
      <FeaturedCollection products={featured} />
      <LocalIntro />
      <HowToOrder />
      <BrandStory />
      <Testimonials />
      <Faq />
      <StoreInfo />
      <StoreMap />
    </>
  );
}
