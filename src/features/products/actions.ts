"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { fail, succeed, type ActionResult } from "@/lib/action-result";
import { requireSession } from "@/features/auth/session";
import { productSchema } from "./schemas";
import { generateUniqueSlug } from "./slug";
import type { ProductFormValues } from "./types";

const refresh = () => {
  revalidatePath("/admin/dashboard", "layout");
  revalidatePath("/");
  revalidatePath("/koleksi");
  revalidatePath("/produk/[slug]", "page");
};

export async function saveProduct(id: string | null, values: ProductFormValues): Promise<ActionResult> {
  await requireSession();
  const parsed = productSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const { image, badge, occasionIds, categoryId, ...rest } = parsed.data;
  const occasionSet = [...new Set(occasionIds)];

  // Koleksi hanya boleh berisi tipe COLLECTION, acara hanya OCCASION.
  if (categoryId) {
    const collection = await prisma.category.findFirst({ where: { id: categoryId, type: "COLLECTION" }, select: { id: true } });
    if (!collection) return fail("Koleksi tidak valid.");
  }
  if (occasionSet.length) {
    const valid = await prisma.category.count({ where: { id: { in: occasionSet }, type: "OCCASION" } });
    if (valid !== occasionSet.length) return fail("Ada acara yang tidak valid.");
  }

  const data = { ...rest, categoryId, image: image || null, badge: badge || null };

  if (id) {
    // Slug tidak berubah saat nama diedit (URL yang sudah dikenal Google tetap stabil).
    const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
    const slug = existing?.slug ?? (await generateUniqueSlug(parsed.data.name));
    await prisma.product.update({ where: { id }, data: { ...data, slug, occasions: { set: occasionSet.map((o) => ({ id: o })) } } });
  } else {
    const slug = await generateUniqueSlug(parsed.data.name);
    await prisma.product.create({ data: { ...data, slug, occasions: { connect: occasionSet.map((o) => ({ id: o })) } } });
  }
  refresh();
  return succeed(undefined);
}

export async function toggleProductFlag(id: string, field: "isActive" | "soldOut", value: boolean): Promise<ActionResult> {
  await requireSession();
  if (field !== "isActive" && field !== "soldOut") return fail("Field tidak valid.");
  await prisma.product.update({ where: { id }, data: { [field]: value } });
  refresh();
  return succeed(undefined);
}

/** Produk yang pernah dipakai transaksi hanya dinonaktifkan agar histori tetap aman. */
export async function deleteProduct(id: string): Promise<ActionResult<{ archived: boolean }>> {
  await requireSession();
  const usedCount = await prisma.transactionItem.count({ where: { productId: id } });
  if (usedCount > 0) {
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    refresh();
    return succeed({ archived: true });
  }
  await prisma.product.delete({ where: { id } });
  refresh();
  return succeed({ archived: false });
}