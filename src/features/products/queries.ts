import "server-only";
import { prisma } from "@/lib/prisma";
import type { CategoryOptions, ProductRow } from "./types";

export async function getProductRows(): Promise<ProductRow[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, occasions: { select: { id: true, name: true }, orderBy: { name: "asc" } } },
  });
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    image: p.image,
    categoryId: p.categoryId,
    categoryName: p.category?.name ?? null,
    occasionIds: p.occasions.map((o) => o.id),
    occasionNames: p.occasions.map((o) => o.name),
    price: p.price,
    isActive: p.isActive,
    soldOut: p.soldOut,
    badge: p.badge,
  }));
}

export async function getCategoryOptions(): Promise<CategoryOptions> {
  const rows = await prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, type: true } });
  const pick = (type: "COLLECTION" | "OCCASION") => rows.filter((r) => r.type === type).map(({ id, name }) => ({ id, name }));
  return { collections: pick("COLLECTION"), occasions: pick("OCCASION") };
}