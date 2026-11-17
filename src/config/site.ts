import { STORE } from "./store";

export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  name: STORE.name,
  city: "Ambon",
  region: "Maluku",
  country: "ID",
  // PENTING: nama, alamat, dan telepon harus SAMA PERSIS dengan Google Business Profile.
  streetAddress: STORE.address,
  postalCode: "", // isi kode pos asli
  geo: null as { latitude: number; longitude: number } | null, // isi dari Google Maps, mis. { latitude: -3.xx, longitude: 128.xx }
  hours: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "10:00", closes: "21:00" },
  priceRange: "Rp",
  defaultOgImage: "/og-default.jpg",
  serviceAreas: ["Nusaniwe", "Sirimau", "Teluk Ambon", "Teluk Ambon Baguala", "Leitimur Selatan"],
} as const;

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;