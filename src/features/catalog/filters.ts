import { CATALOG_SORTS, type CatalogSort } from "./constants";
import type { CatalogFilters } from "./types";

type Source = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
const isSort = (value: string): value is CatalogSort => (CATALOG_SORTS as readonly string[]).includes(value);

export const DEFAULT_FILTERS: CatalogFilters = { q: "", collection: "", occasion: "", sort: "terbaru", availableOnly: false };

export function parseCatalogFilters(sp: Source): CatalogFilters {
  const sort = first(sp.urut);
  return {
    q: first(sp.q).trim().slice(0, 80),
    collection: first(sp.koleksi),
    occasion: first(sp.acara),
    sort: isSort(sort) ? sort : "terbaru",
    availableOnly: first(sp.tersedia) === "1",
  };
}

export function parsePage(sp: Source): number {
  const n = Number.parseInt(first(sp.page), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/** URL /koleksi dari filter + perubahan. Nilai default tidak ditulis agar URL tetap bersih. */
export function buildCatalogHref(filters: CatalogFilters, patch: Partial<CatalogFilters> & { page?: number } = {}): string {
  const { page, ...changes } = patch;
  const next = { ...filters, ...changes };
  const params = new URLSearchParams();
  if (next.collection) params.set("koleksi", next.collection);
  if (next.occasion) params.set("acara", next.occasion);
  if (next.q) params.set("q", next.q);
  if (next.sort !== "terbaru") params.set("urut", next.sort);
  if (next.availableOnly) params.set("tersedia", "1");
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/koleksi?${query}` : "/koleksi";
}