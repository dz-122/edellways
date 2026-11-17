"use server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fail, succeed, type ActionResult } from "@/lib/action-result";
import { slugify } from "@/lib/utils";
import { requireSession } from "@/features/auth/session";
import type { CategoryType } from "./constants";
import { categorySchema } from "./schemas";

const refresh = () => {
  revalidatePath("/admin/dashboard", "layout");
  revalidatePath("/");
  revalidatePath("/koleksi");
};

/** Tipe hanya ditentukan saat dibuat; saat edit hanya nama yang berubah. */
export async function saveCategory(id: string | null, name: string, type: CategoryType): Promise<ActionResult> {
  await requireSession();
  const parsed = categorySchema.safeParse({ name, type });
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const slug = slugify(parsed.data.name);
  if (!slug) return fail("Nama tidak valid.");

  try {
    if (id) await prisma.category.update({ where: { id }, data: { name: parsed.data.name, slug } });
    else await prisma.category.create({ data: { name: parsed.data.name, slug, type: parsed.data.type } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return fail("Nama itu sudah dipakai (koleksi atau acara).");
    throw e;
  }
  refresh();
  return succeed(undefined);
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireSession();
  await prisma.category.delete({ where: { id } }); // relasi ke produk otomatis terlepas
  refresh();
  return succeed(undefined);
}