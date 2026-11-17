import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      select: {
        slug: true,
        type: true,
        updatedAt: true,
        _count: {
          select: {
            products: { where: { isActive: true } },
            occasionProducts: { where: { isActive: true } },
          },
        },
      },
    }),
  ]);

  // Halaman landing tanpa produk tidak dimasukkan agar tidak dianggap thin content.
  const landing = categories
    .filter(
      (c) =>
        (c.type === "COLLECTION"
          ? c._count.products
          : c._count.occasionProducts) > 0,
    )
    .map((c) => ({
      url: absoluteUrl(
        `/koleksi?${c.type === "COLLECTION" ? "koleksi" : "acara"}=${c.slug}`,
      ),
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/koleksi"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...landing,
    ...products.map((p) => ({
      url: absoluteUrl(`/produk/${p.slug ?? p.id}`),
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
