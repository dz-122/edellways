import "server-only";
import { prisma } from "@/lib/prisma";
import type { CategoryRow } from "./types";

export async function getCategoryRows(): Promise<CategoryRow[]> {
  const categories = await prisma.category.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true, occasionProducts: true } } },
  });
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    type: c.type,
    productCount: c.type === "COLLECTION" ? c._count.products : c._count.occasionProducts,
  }));
}