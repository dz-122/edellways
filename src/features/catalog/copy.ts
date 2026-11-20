
export const CATALOG_COPY = {
  collectionsHeading: "Jelajahi Koleksi Kami",
  allCollections: "Semua Koleksi",
  allOccasions: "Semua Acara",
  occasionLabel: "Filter berdasarkan acara",
  searchPlaceholder: "Cari rangkaian bunga...",
  sortBy: "Urutkan:",
  showing: (n: number) =>
    `Menampilkan ${n} rangkaian bunga`,
  clearFilters: "Hapus Filter",
  empty: "Rangkaian bunga tidak ditemukan",
  emptyCta: "Lihat Semua Koleksi",
  swipeHint: "Geser untuk melihat lainnya",
  previous: "Sebelumnya",
  next: "Selanjutnya",
  loadingMore: "Memuat rangkaian bunga lainnya...",
  retry: "Gagal memuat. Ketuk untuk mencoba lagi.",
  endOfList: (n: number) =>
    `Kamu telah melihat semua ${n} rangkaian bunga`,
} as const;
