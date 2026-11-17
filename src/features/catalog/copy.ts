// Semua teks UI halaman katalog ada di sini. Ganti ke bahasa Indonesia cukup dengan mengubah nilainya.
export const CATALOG_COPY = {
  collectionsHeading: "Explore our Collections",
  allCollections: "Semua Koleksi",
  allOccasions: "Semua Acara",
  occasionLabel: "Filter by occasion",
  searchPlaceholder: "Search for flowers...",
  sortBy: "Sort by:",
  showing: (n: number) =>
    `Showing ${n} ${n === 1 ? "arrangement" : "arrangements"}`,
  clearFilters: "Clear filters",
  empty: "No arrangements found",
  emptyCta: "View all collections",
  swipeHint: "Swipe to see more collections",
  previous: "Previous",
  next: "Next",
  loadingMore: "Loading more arrangements",
  retry: "Couldn't load more. Tap to retry.",
  endOfList: (n: number) => `You've seen all ${n} arrangements`,
} as const;
