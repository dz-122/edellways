import { PrismaClient, type CategoryType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Nama bisa diubah kapan saja dari admin.
const COLLECTIONS = ["Edell Essential", "Edell Signature"];
const OCCASIONS = ["Wisuda", "Wedding", "Ulang Tahun", "Anniversary", "Ucapan Duka", "Hadiah"];

async function seedCategories(names: string[], type: CategoryType) {
  for (const name of names) {
    const slug = slugify(name);
    await prisma.category.upsert({ where: { slug }, update: {}, create: { name, slug, type } });
  }
}

// Mengisi slug untuk produk lama. Aman dijalankan berulang.
async function backfillProductSlugs() {
  const missing = await prisma.product.findMany({ where: { slug: null }, select: { id: true, name: true }, orderBy: { createdAt: "asc" } });
  const used = await prisma.product.findMany({ where: { slug: { not: null } }, select: { slug: true } });
  const taken = new Set(used.map((p) => p.slug as string));

  for (const p of missing) {
    const base = slugify(p.name).slice(0, 80) || "produk";
    let slug = base;
    let n = 1;
    while (taken.has(slug)) slug = `${base}-${++n}`;
    taken.add(slug);
    await prisma.product.update({ where: { id: p.id }, data: { slug } });
  }
  console.log(`Slug produk diisi: ${missing.length}`);
}

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@edellways.com").toLowerCase();
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? "ganti-password-ini", 12);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name: process.env.SEED_ADMIN_NAME ?? "Admin Edellways", passwordHash },
  });

  await seedCategories(COLLECTIONS, "COLLECTION");
  await seedCategories(OCCASIONS, "OCCASION");
  await backfillProductSlugs();
  console.log(`Seed selesai. Login: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());