
export const CATALOG_COPY = {
  collectionsHeading: "Jelajahi Koleksi Kami",
  allCollections: "Semua Koleksi",
  allOccasions: "Semua Acara",
  occasionLabel: "Filter berdasarkan acara",
  searchPlaceholder: "Cari buket, hampers atau giftbox...",
  sortBy: "Urutkan:",
  showing: (n: number) =>
    `Menampilkan ${n} list produk`,
  clearFilters: "Hapus Filter",
  empty: "Produk tidak ditemukan",
  emptyCta: "Lihat Semua Koleksi",
  swipeHint: "Geser untuk melihat lainnya",
  previous: "Sebelumnya",
  next: "Selanjutnya",
  loadingMore: "Memuat rangkaian lainnya...",
  retry: "Gagal memuat. Ketuk untuk mencoba lagi.",
  endOfList: (n: number) =>
    `Kamu telah melihat semua ${n} rangkaian bunga`,
} as const;
