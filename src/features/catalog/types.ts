import type { CatalogSort } from "./constants";

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  badge: string | null;
  soldOut: boolean;
  categoryName: string | null; // nama koleksi
};

export type CategoryLink = { id: string; name: string; slug: string; count: number };

export type CatalogTaxonomy = { collections: CategoryLink[]; occasions: CategoryLink[] };

export type HomeData = CatalogTaxonomy & {
  newArrivals: CatalogProduct[];
  featured: CatalogProduct[];
  christmas: CatalogProduct[];
};

export type CatalogFilters = {
  q: string;
  collection: string; // slug koleksi (diisi oleh halaman landing)
  occasion: string; // slug acara (diisi oleh halaman landing)
  sort: CatalogSort;
  availableOnly: boolean;
};

export type CatalogPage = {
  rows: CatalogProduct[];
  page: number;
  pageCount: number;
  totalCount: number;
};

export type ProductDetail = CatalogProduct & {
  description: string;
  categorySlug: string | null;
  occasions: { name: string; slug: string }[];
};

/** Angka filter yang dihitung dari filter lain yang sedang aktif. */
export type CatalogFacets = {
  collections: CategoryLink[];
  occasions: CategoryLink[];
  collectionsTotal: number; // jumlah hasil jika "All Collections" dipilih
  occasionsTotal: number; // jumlah hasil jika "All occasions" dipilih
};