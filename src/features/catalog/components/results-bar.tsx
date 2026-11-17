"use client";
import { CATALOG_COPY } from "../copy";
import { useCatalogNav } from "./catalog-nav-provider";

export function ResultsBar({ total }: { total: number }) {
  const { filters, clearAll } = useCatalogNav();
  const hasFilters = Boolean(filters.q || filters.collection || filters.occasion);

  return (
    <p aria-live="polite" className="mb-3 text-sm text-ink/70">
      {CATALOG_COPY.showing(total)}
      {hasFilters && (
        <>
          {" · "}
          <button type="button" onClick={clearAll} className="text-forest underline underline-offset-4">
            {CATALOG_COPY.clearFilters}
          </button>
        </>
      )}
    </p>
  );
}