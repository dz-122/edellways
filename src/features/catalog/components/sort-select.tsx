"use client";
import { NativeSelect } from "@/components/shared/native-select";
import { CATALOG_SORTS, SORT_LABELS } from "../constants";
import { CATALOG_COPY } from "../copy";
import { useCatalogNav } from "./catalog-nav-provider";

export function SortSelect() {
  const { filters, update } = useCatalogNav();
  return (
    <div className="relative min-w-0 md:w-60">
      <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 text-sm text-ink/55 sm:inline">
        {CATALOG_COPY.sortBy}
      </span>
      <NativeSelect
        aria-label={CATALOG_COPY.sortBy}
        className="h-10 rounded-full border-forest/15 bg-white pl-4 pr-8 sm:pl-[4.6rem]"
        value={filters.sort}
        onChange={(e) => update({ urut: e.target.value === "terbaru" ? null : e.target.value })}
      >
        {CATALOG_SORTS.map((s) => (
          <option key={s} value={s}>{SORT_LABELS[s]}</option>
        ))}
      </NativeSelect>
    </div>
  );
}