"use server";
import { z } from "zod";
import { CATALOG_SORTS } from "./constants";
import { getCatalogPage } from "./queries";
import type { CatalogFilters, CatalogProduct } from "./types";

const schema = z.object({
  q: z.string().max(80),
  collection: z.string().max(80),
  occasion: z.string().max(80),
  sort: z.enum(CATALOG_SORTS),
  availableOnly: z.boolean(),
  page: z.number().int().min(1).max(500),
});

export type LoadMoreResult = { rows: CatalogProduct[]; page: number; pageCount: number };

/** Mengambil halaman berikutnya untuk infinite scroll. Input divalidasi karena action ini publik. */
export async function loadMoreProducts(filters: CatalogFilters, page: number): Promise<LoadMoreResult | null> {
  const parsed = schema.safeParse({ ...filters, page });
  if (!parsed.success) return null;
  const { page: requested, ...rest } = parsed.data;
  const result = await getCatalogPage(rest, requested);
  return { rows: result.rows, page: result.page, pageCount: result.pageCount };
}