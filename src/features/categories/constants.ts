export const CATEGORY_TYPES = ["COLLECTION", "OCCASION"] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];

export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  COLLECTION: "Koleksi",
  OCCASION: "Produk",
};

export const CATEGORY_TYPE_HINTS: Record<CategoryType, string> = {
  COLLECTION: "Lini khas toko. Satu produk masuk ke satu koleksi, mis. Edell Essential.",
  OCCASION: "Momen pemakaian. Satu produk boleh cocok untuk banyak acara, mis. Wisuda, Wedding.",
};