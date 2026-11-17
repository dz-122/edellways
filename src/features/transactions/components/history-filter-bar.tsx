"use client";
import { useEffect, useState } from "react";
import { Download, Loader2, Search, X } from "lucide-react";
import { NativeSelect } from "@/components/shared/native-select";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah, toDateKey } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PAYMENT_LABELS, type PaymentMethod } from "../constants";
import { useUrlParams } from "../hooks/use-url-params";
import type { HistoryFilters, HistoryStatus } from "../types";

type Preset = "today" | "7d" | "30d" | "month";

const PRESETS: { id: Preset; label: string }[] = [
  { id: "today", label: "Hari ini" },
  { id: "7d", label: "7 hari" },
  { id: "30d", label: "30 hari" },
  { id: "month", label: "Bulan ini" },
];

function presetRange(id: Preset): { from: string; to: string } {
  const now = new Date();
  const today = toDateKey(now);
  const daysAgo = (n: number) => toDateKey(new Date(now.getTime() - n * 86_400_000));
  if (id === "today") return { from: today, to: today };
  if (id === "7d") return { from: daysAgo(6), to: today };
  if (id === "30d") return { from: daysAgo(29), to: today };
  return { from: `${today.slice(0, 8)}01`, to: today };
}

const METHOD_OPTIONS: { value: PaymentMethod | ""; label: string }[] = [
  { value: "", label: "Semua" },
  { value: "CASH", label: PAYMENT_LABELS.CASH },
  { value: "NON_CASH", label: PAYMENT_LABELS.NON_CASH },
];

const STATUS_OPTIONS: { value: HistoryStatus; label: string }[] = [
  { value: "active", label: "Aktif" },
  { value: "archived", label: "Arsip" },
  { value: "all", label: "Semua" },
];

type HistoryFilterBarProps = {
  filters: HistoryFilters;
  cashiers: string[];
  totalCount: number;
  totalSales: number;
};

export function HistoryFilterBar({ filters, cashiers, totalCount, totalSales }: HistoryFilterBarProps) {
  const { searchParams, update, reset, pending } = useUrlParams();
  const [query, setQuery] = useState(filters.q);

  // Pencarian otomatis setelah berhenti mengetik.
  useEffect(() => {
    if (query.trim() === filters.q) return;
    const timer = setTimeout(() => update({ q: query.trim() || null }), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const activePreset = PRESETS.find((p) => {
    const range = presetRange(p.id);
    return range.from === filters.from && range.to === filters.to;
  })?.id;

  const chips: { label: string; clear: () => void }[] = [];
  if (filters.q) chips.push({ label: `Cari: ${filters.q}`, clear: () => { setQuery(""); update({ q: null }); } });
  if (filters.from || filters.to) chips.push({ label: `${filters.from || "..."} s/d ${filters.to || "..."}`, clear: () => update({ from: null, to: null }) });
  if (filters.cashier) chips.push({ label: `Kasir: ${filters.cashier}`, clear: () => update({ cashier: null }) });
  if (filters.method) chips.push({ label: PAYMENT_LABELS[filters.method], clear: () => update({ method: null }) });
  if (filters.status !== "active") chips.push({ label: filters.status === "archived" ? "Arsip" : "Aktif + arsip", clear: () => update({ status: null }) });

  const exportParams = new URLSearchParams(searchParams.toString());
  exportParams.delete("page");

  return (
    <div className="mb-4 space-y-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-60 flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="px-9"
            placeholder="Cari kasir, pelanggan, produk, atau no. transaksi"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cari transaksi"
          />
          {query && (
            <button type="button" aria-label="Hapus pencarian" className="absolute right-2 top-2 rounded p-0.5 text-muted-foreground hover:text-foreground"
              onClick={() => { setQuery(""); update({ q: null }); }}>
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button asChild variant="outline">
          <a href={`/api/export/transactions?${exportParams}`}>
            <Download /> Ekspor Excel
          </a>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => update({ from: null, to: null })}
          className={cn("rounded-full border px-3 py-1 text-sm transition", !filters.from && !filters.to ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}
        >
          Semua tanggal
        </button>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => update(presetRange(p.id))}
            className={cn("rounded-full border px-3 py-1 text-sm transition", activePreset === p.id ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            {p.label}
          </button>
        ))}
        <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
        <Input type="date" value={filters.from} max={filters.to || undefined} onChange={(e) => update({ from: e.target.value || null })} className="h-8 w-36" aria-label="Dari tanggal" />
        <span className="text-sm text-muted-foreground">s/d</span>
        <Input type="date" value={filters.to} min={filters.from || undefined} onChange={(e) => update({ to: e.target.value || null })} className="h-8 w-36" aria-label="Sampai tanggal" />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Metode</span>
          <SegmentedControl label="Metode pembayaran" value={filters.method} options={METHOD_OPTIONS} onChange={(v) => update({ method: v || null })} />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Status</span>
          <SegmentedControl label="Status transaksi" value={filters.status} options={STATUS_OPTIONS} onChange={(v) => update({ status: v === "active" ? null : v })} />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Kasir</span>
          <NativeSelect className="h-8 w-40" value={filters.cashier} onChange={(e) => update({ cashier: e.target.value || null })} aria-label="Kasir">
            <option value="">Semua kasir</option>
            {cashiers.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t pt-3 text-sm">
        <p className="font-medium">
          {totalCount} transaksi <span className="text-muted-foreground">·</span> {formatRupiah(totalSales)}
        </p>
        {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          {chips.map((chip) => (
            <span key={chip.label} className="inline-flex items-center gap-1 rounded-full bg-accent py-0.5 pl-2.5 pr-1 text-xs text-accent-foreground">
              {chip.label}
              <button type="button" aria-label={`Hapus filter ${chip.label}`} onClick={chip.clear} className="rounded-full p-0.5 hover:bg-primary/10">
                <X className="size-3" />
              </button>
            </span>
          ))}
          {chips.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => { setQuery(""); reset(); }}>
              Reset semua
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
