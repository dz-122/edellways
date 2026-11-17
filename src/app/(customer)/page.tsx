import { getHomeData } from "@/features/catalog/queries";
import { BrandStory } from "@/features/storefront/components/brand-story";
import { Hero } from "@/features/storefront/components/hero";
import { HowToOrder } from "@/features/storefront/components/how-to-order";
import { Occasions } from "@/features/storefront/components/occasions";
import { PerksMarquee } from "@/features/storefront/components/perks-marquee";
import {
  FeaturedCollection,
  NewArrivals,
} from "@/features/storefront/components/product-sections";
import { StoreInfo } from "@/features/storefront/components/store-info";
import { Testimonials } from "@/features/storefront/components/testimonials";

export const revalidate = 60;

export default async function HomePage() {
  const { collections, occasions, newArrivals, featured } = await getHomeData();
  const heroProduct = newArrivals.find((p) => p.image) ?? null;

  return (
    <>
      <Hero image={newArrivals.find((p) => p.image)?.image ?? null} productName={newArrivals.find((p) => p.image)?.name ?? null} />``
      <PerksMarquee />
      <Occasions occasions={occasions} />
      <NewArrivals products={newArrivals} />
      <FeaturedCollection products={featured} />
      <HowToOrder />
      <BrandStory />
      <Testimonials />
      <StoreInfo />
    </>
  );
}
