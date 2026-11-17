export const CATALOG_PAGE_SIZE = 12;

export const CATALOG_SORTS = ["terbaru", "termurah", "termahal", "nama"] as const;
export type CatalogSort = (typeof CATALOG_SORTS)[number];

export const SORT_LABELS: Record<CatalogSort, string> = {
  terbaru: "Newest",
  termurah: "Price: Low to High",
  termahal: "Price: High to Low",
  nama: "Name: A-Z",
};