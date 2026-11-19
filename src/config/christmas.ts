import { STORE } from "./store";

export const CHRISTMAS = {
  occasionSlug: "natal", // slug acara "Natal" di admin
  href: "/koleksi?acara=natal",
  countdownWindowDays: 60, // hitung mundur tampil sejak sekian hari sebelum Natal
} as const;

/** Selisih hari ke 25 Desember (zona waktu toko). Setelah Natal bernilai besar, sehingga hitung mundur tidak tampil. */
export function daysUntilChristmas(now = new Date()): number {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: STORE.timezone }).format(now); // YYYY-MM-DD
  const [y, m, d] = today.split("-").map(Number);
  const targetYear = m === 12 && d > 25 ? y + 1 : y;
  return Math.round((Date.UTC(targetYear, 11, 25) - Date.UTC(y, m - 1, d)) / 86_400_000);
}