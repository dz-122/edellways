"use client";
import { cn } from "@/lib/utils";
import { CATALOG_COPY } from "../copy";
import { buildCatalogHref } from "../filters";
import type { CatalogFacets } from "../types";
import { useCatalogNav } from "./catalog-nav-provider";
import { ScrollRow } from "./scroll-row";
import { SoftLink } from "./soft-link";

/** Tablet & HP: tab koleksi. Tersebar rata jika muat, bisa digeser jika tidak. */
export function CollectionTabs({ facets }: { facets: CatalogFacets }) {
  const { filters, update } = useCatalogNav();
  const items = [{ id: "all", name: CATALOG_COPY.allCollections, slug: "", count: facets.collectionsTotal }, ...facets.collections];

  return (
    <nav aria-label={CATALOG_COPY.collectionsHeading}>
        <ScrollRow hint={CATALOG_COPY.swipeHint} activeKey={filters.collection} className="-mx-4 gap-1 px-4 md:-mx-6 md:px-6">
        {items.map((c) => {
          const active = filters.collection === c.slug;
          const disabled = !active && c.count === 0; // tidak ada hasil -> redup, tidak bisa diklik
          const className = cn(
            "shrink-0 grow basis-auto whitespace-nowrap rounded-xl px-4 py-2.5 text-center text-[15px] transition",
            active ? "bg-blush/60 font-medium text-forest" : "text-ink/75 hover:bg-white",
            disabled && "pointer-events-none opacity-35"
          );
          return disabled ? (
            <span key={c.id} aria-disabled="true" className={className}>{c.name}</span>
          ) : (
            <SoftLink
              key={c.id}
              href={buildCatalogHref(filters, { collection: c.slug })}
              onSelect={() => update({ koleksi: c.slug || null })}
              aria-current={active ? "true" : undefined}
              className={className}
            >
              {c.name}
            </SoftLink>
          );
        })}
      </ScrollRow>
    </nav>
  );
}