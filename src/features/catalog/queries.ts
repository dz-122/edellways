import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CATALOG_PAGE_SIZE, type CatalogSort } from "./constants";
import type { CatalogFacets, CatalogFilters, CatalogPage, CatalogProduct, CatalogTaxonomy, HomeData, ProductDetail } from "./types";

const productSelect = {
  id: true,
  slug: true,
  name: true,
  price: true,
  image: true,
  badge: true,
  soldOut: true,
  category: { select: { name: true } },
} satisfies Prisma.ProductSelect;

type ProductRecord = Prisma.ProductGetPayload<{ select: typeof productSelect }>;

const toCatalogProduct = (p: ProductRecord): CatalogProduct => ({
  id: p.id,
  slug: p.slug ?? p.id, // cadangan sebelum slug diisi oleh db:seed
  name: p.name,
  price: p.price,
  image: p.image,
  badge: p.badge,
  soldOut: p.soldOut,
  categoryName: p.category?.name ?? null,
});

/* ---------- Taksonomi: koleksi & acara ---------- */

export const getCatalogTaxonomy = cache(async (): Promise<CatalogTaxonomy> => {
  const rows = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      _count: { select: { products: { where: { isActive: true } }, occasionProducts: { where: { isActive: true } } } },
    },
  });
  return {
    collections: rows.filter((r) => r.type === "COLLECTION").map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.products })),
    occasions: rows.filter((r) => r.type === "OCCASION").map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.occasionProducts })),
  };
});

/* ---------- Beranda ---------- */

export async function getHomeData(): Promise<HomeData> {
  const [taxonomy, newArrivals, bestSellers] = await Promise.all([
    getCatalogTaxonomy(),
    prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 8, select: productSelect }),
    prisma.transactionItem.groupBy({
      by: ["productId"],
      where: { productId: { not: null }, transaction: { deletedAt: null } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 12,
    }),
  ]);

  // Featured = produk terlaris; jika belum cukup, dilengkapi produk terbaru.
  const bestIds = bestSellers.map((b) => b.productId).filter((id): id is string => id !== null);
  let featured: CatalogProduct[] = [];
  if (bestIds.length) {
    const rows = await prisma.product.findMany({ where: { id: { in: bestIds }, isActive: true }, select: productSelect });
    featured = bestIds
      .map((id) => rows.find((r) => r.id === id))
      .filter((r): r is ProductRecord => r !== undefined)
      .slice(0, 4)
      .map(toCatalogProduct);
  }
  if (featured.length < 4) {
    const extra = await prisma.product.findMany({
      where: { isActive: true, id: { notIn: featured.map((f) => f.id) } },
      orderBy: { createdAt: "desc" },
      take: 4 - featured.length,
      select: productSelect,
    });
    featured = [...featured, ...extra.map(toCatalogProduct)];
  }

  return { ...taxonomy, newArrivals: newArrivals.map(toCatalogProduct), featured };
}

/* ---------- Katalog ---------- */

function orderByFor(sort: CatalogSort): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "termurah":
      return { price: "asc" };
    case "termahal":
      return { price: "desc" };
    case "nama":
      return { name: "asc" };
    default:
      return { createdAt: "desc" };
  }
}

type FacetOmit = "collection" | "occasion";

/**
 * Satu sumber aturan filter untuk daftar hasil DAN angka filter.
 * `omit` dipakai untuk menghitung angka sebuah filter tanpa memperhitungkan pilihannya sendiri.
 */
function buildProductWhere(filters: CatalogFilters, omit?: FacetOmit): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [{ isActive: true }]; // produk nonaktif tidak pernah tampil
  if (filters.q) {
    const contains = { contains: filters.q, mode: "insensitive" as const };
    and.push({ OR: [{ name: contains }, { description: contains }, { category: { name: contains } }, { occasions: { some: { name: contains } } }] });
  }
  if (filters.collection && omit !== "collection") and.push({ category: { slug: filters.collection, type: "COLLECTION" } });
  if (filters.occasion && omit !== "occasion") and.push({ occasions: { some: { slug: filters.occasion, type: "OCCASION" } } });
  if (filters.availableOnly) and.push({ soldOut: false });
  return { AND: and };
}

export async function getCatalogPage(filters: CatalogFilters, requestedPage: number): Promise<CatalogPage> {
  const where = buildProductWhere(filters);
  const totalCount = await prisma.product.count({ where });
  const pageCount = Math.max(1, Math.ceil(totalCount / CATALOG_PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);

  const rows = await prisma.product.findMany({
    where,
    orderBy: [orderByFor(filters.sort), { id: "asc" }],
    skip: (page - 1) * CATALOG_PAGE_SIZE,
    take: CATALOG_PAGE_SIZE,
    select: productSelect,
  });
  return { rows: rows.map(toCatalogProduct), page, pageCount, totalCount };
}

export async function getCatalogFacets(filters: CatalogFilters): Promise<CatalogFacets> {
  const collectionWhere = buildProductWhere(filters, "collection"); // abaikan pilihan koleksi sendiri
  const occasionWhere = buildProductWhere(filters, "occasion"); // abaikan pilihan acara sendiri

  const [rows, collectionsTotal, occasionsTotal] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        _count: { select: { products: { where: collectionWhere }, occasionProducts: { where: occasionWhere } } },
      },
    }),
    prisma.product.count({ where: collectionWhere }),
    prisma.product.count({ where: occasionWhere }),
  ]);

  return {
    collections: rows.filter((r) => r.type === "COLLECTION").map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.products })),
    occasions: rows.filter((r) => r.type === "OCCASION").map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.occasionProducts })),
    collectionsTotal,
    occasionsTotal,
  };
}

/* ---------- Info halaman landing koleksi / acara ---------- */

// cache() agar generateMetadata dan page tidak query dua kali.
export const getCategoryLanding = cache(async (type: "COLLECTION" | "OCCASION", slug: string) => {
  const category = await prisma.category.findFirst({ where: { slug, type }, select: { id: true, name: true, slug: true } });
  if (!category) return null;

  const where: Prisma.ProductWhereInput =
    type === "COLLECTION" ? { isActive: true, categoryId: category.id } : { isActive: true, occasions: { some: { id: category.id } } };
  const [productCount, withImage] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findFirst({ where: { ...where, image: { not: null } }, orderBy: { createdAt: "desc" }, select: { image: true } }),
  ]);
  return { category: { name: category.name, slug: category.slug }, productCount, image: withImage?.image ?? null };
});

/* ---------- Detail produk ---------- */

// Menerima slug; ID lama tetap dikenali supaya bisa dialihkan ke URL slug.
export const getProductDetail = cache(
  async (key: string): Promise<{ product: ProductDetail; related: CatalogProduct[] } | null> => {
    const row = await prisma.product.findFirst({
      where: { isActive: true, OR: [{ slug: key }, { id: key }] },
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        image: true,
        badge: true,
        soldOut: true,
        description: true,
        categoryId: true,
        category: { select: { name: true, slug: true } },
        occasions: { select: { name: true, slug: true }, orderBy: { name: "asc" } },
      },
    });
    if (!row) return null;

    const related = await prisma.product.findMany({
      where: { isActive: true, id: { not: row.id }, ...(row.categoryId ? { categoryId: row.categoryId } : {}) },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: productSelect,
    });
    if (related.length < 4) {
      const more = await prisma.product.findMany({
        where: { isActive: true, id: { notIn: [row.id, ...related.map((r) => r.id)] } },
        orderBy: { createdAt: "desc" },
        take: 4 - related.length,
        select: productSelect,
      });
      related.push(...more);
    }

    return {
      product: {
        id: row.id,
        slug: row.slug ?? row.id,
        name: row.name,
        price: row.price,
        image: row.image,
        badge: row.badge,
        soldOut: row.soldOut,
        description: row.description,
        categoryName: row.category?.name ?? null,
        categorySlug: row.category?.slug ?? null,
        occasions: row.occasions,
      },
      related: related.map(toCatalogProduct),
    };
  }
);