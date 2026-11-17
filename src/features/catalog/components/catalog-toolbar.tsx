"use client";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CATALOG_COPY } from "../copy";
import type { CatalogFacets } from "../types";
import { useCatalogNav } from "./catalog-nav-provider";
import { OccasionSelect } from "./occasion-select";
import { SortSelect } from "./sort-select";

/**
 * Tablet & desktop: [ Search ................ ][ Acara ][ Sort by ]
 * HP:                [ Search ........................... ]
 *                    [ Acara ........ ][ Sort by ......... ]
 */
export function CatalogToolbar({ facets }: { facets: CatalogFacets }) {
  const { filters, update } = useCatalogNav();
  const [query, setQuery] = useState(filters.q);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cari otomatis setelah berhenti mengetik.
  useEffect(() => {
    if (query.trim() === filters.q) return;
    const timer = setTimeout(() => update({ q: query.trim() || null }), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Sinkron saat pencarian dihapus dari luar ("Clear filters"). Jangan menimpa saat sedang mengetik.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setQuery(filters.q);
  }, [filters.q]);

  return (
        <div className="mb-6 grid grid-cols-2 gap-2 md:flex md:items-center md:gap-3">
      <div className="relative col-span-2 min-w-0 md:flex-1">
        <Search className="pointer-events-none absolute left-4 top-3 size-4 text-ink/45" />
        <Input
          ref={inputRef}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          className="h-10 rounded-full border-forest/15 bg-white pl-11 pr-10"
          placeholder={CATALOG_COPY.searchPlaceholder}
          aria-label={CATALOG_COPY.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button type="button" aria-label="Clear search" className="absolute right-3.5 top-3 text-ink/45 hover:text-ink" onClick={() => { setQuery(""); update({ q: null }); }}>
            <X className="size-4" />
          </button>
        )}
      </div>

      <OccasionSelect facets={facets} />
      <SortSelect />
    </div>
  );
}