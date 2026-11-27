import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE } from "@/config/site";
import { getHomeData } from "@/features/catalog/queries";
import { BrandStory } from "@/features/storefront/components/brand-story";
import { ChristmasSection } from "@/features/storefront/components/christmas-section";
import { Hero } from "@/features/storefront/components/hero";
import { HowToOrder } from "@/features/storefront/components/how-to-order";
import { PerksMarquee } from "@/features/storefront/components/perks-marquee";
import { FeaturedCollection } from "@/features/storefront/components/product-sections";
import { StoreInfo } from "@/features/storefront/components/store-info";
import { StoreMap } from "@/features/storefront/components/store-map";
import { Testimonials } from "@/features/storefront/components/testimonials";
import { container } from "@/features/storefront/styles";
import { buildFloristSchema, buildWebsiteSchema } from "@/lib/seo/schema";
import { Occasions } from "@/features/storefront/components/occasions";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: `${SITE.name} | Bouquet, Hampers & Giftbox`,
  },
  description: `Edellways Florist ${SITE.city} menyediakan bouquet, hampers, dan giftbox untuk wisuda, wedding, ulang tahun, serta berbagai momen spesial. Pesan dengan mudah melalui WhatsApp.`,
  alternates: { canonical: "/" },
};


export default async function HomePage() {
  const { featured, christmas } = await getHomeData();
  return (
    <>
      <JsonLd data={[buildFloristSchema(), buildWebsiteSchema()]} />
        <Hero />
      <PerksMarquee />
      <Occasions />
      <FeaturedCollection products={featured} />
      <HowToOrder />
      <BrandStory />
      <Testimonials />
      <StoreInfo />
      <StoreMap />
    </>
  );
}
