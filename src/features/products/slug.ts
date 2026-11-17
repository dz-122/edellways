import "server-only";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

/** Slug unik dari nama produk. Bentrok otomatis diberi akhiran -2, -3, dst. */
export async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name).slice(0, 80) || "produk";
  let candidate = base;
  let n = 1;
  while (await prisma.product.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}