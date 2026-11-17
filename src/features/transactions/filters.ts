import { PAYMENT_METHODS, type PaymentMethod } from "./constants";
import type { HistoryFilters } from "./types";

type Source = URLSearchParams | Record<string, string | string[] | undefined>;

function read(source: Source, key: string): string {
  if (source instanceof URLSearchParams) return source.get(key) ?? "";
  const value = source[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

/** Dipakai bersama oleh halaman riwayat dan endpoint ekspor, jadi hasil ekspor = apa yang terlihat. */
export function parseHistoryFilters(source: Source): HistoryFilters {
  const method = read(source, "method");
  const status = read(source, "status");
  const from = read(source, "from");
  const to = read(source, "to");
  return {
    q: read(source, "q").trim(),
    from: isDate(from) ? from : "",
    to: isDate(to) ? to : "",
    cashier: read(source, "cashier"),
    method: (PAYMENT_METHODS as readonly string[]).includes(method) ? (method as PaymentMethod) : "",
    status: status === "archived" || status === "all" ? status : "active",
  };
}

export function parsePage(source: Source): number {
  const n = Number.parseInt(read(source, "page"), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
