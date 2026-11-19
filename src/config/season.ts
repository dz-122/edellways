import { STORE } from "./store";

export const CHRISTMAS = {
  enabled: true, // matikan manual kapan saja
  from: "2026-11-01",
  until: "2026-12-26", // ganti tahun depan
  occasionSlug: "natal", // slug acara "Natal" di admin
  href: "/koleksi?acara=natal",
} as const;

/** Tema Natal aktif otomatis di antara `from` dan `until` (zona waktu toko). */
export function isChristmasSeason(now = new Date()): boolean {
  if (!CHRISTMAS.enabled) return false;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: STORE.timezone }).format(now);
  return today >= CHRISTMAS.from && today <= CHRISTMAS.until;
}