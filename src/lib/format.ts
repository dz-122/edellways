import { STORE } from "@/config/store";

export const formatNumber = (n: number) => n.toLocaleString("id-ID");
export const formatRupiah = (n: number) => `Rp${formatNumber(n)}`;

export const formatDateTime = (d: Date | string) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: STORE.timezone }).format(new Date(d));

/** Kunci tanggal YYYY-MM-DD di zona waktu toko. */
export const toDateKey = (d: Date | string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: STORE.timezone }).format(new Date(d));
