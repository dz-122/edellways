"use client";
import { CalendarDays } from "lucide-react";
import { NativeSelect } from "@/components/shared/native-select";
import { cn } from "@/lib/utils";
import { CATALOG_COPY } from "../copy";
import type { CatalogFacets } from "../types";
import { useCatalogNav } from "./catalog-nav-provider";

export function OccasionSelect({ facets }: { facets: CatalogFacets }) {
  const { filters, update } = useCatalogNav();
  const selected = Boolean(filters.occasion);

  return (
    <div className="relative min-w-0 md:w-56">
      <CalendarDays aria-hidden className={cn("pointer-events-none absolute left-3.5 top-3 size-4", selected ? "text-forest" : "text-ink/45")} />
      <NativeSelect
        aria-label={CATALOG_COPY.occasionLabel}
        value={filters.occasion}
        onChange={(e) => update({ acara: e.target.value || null })}
        className={cn("h-10 rounded-full bg-white pl-10 pr-8", selected ? "border-forest font-medium text-forest" : "border-forest/15")}
      >
        <option value="">{CATALOG_COPY.allOccasions} ({facets.occasionsTotal})</option>
        {facets.occasions.map((o) => (
          <option key={o.id} value={o.slug} disabled={o.count === 0 && o.slug !== filters.occasion}>
            {o.name} ({o.count})
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}