"use client";
import { cn } from "@/lib/utils";
import { CATALOG_COPY } from "../copy";
import { buildCatalogHref } from "../filters";
import type { CatalogFacets } from "../types";
import { useCatalogNav } from "./catalog-nav-provider";
import { SoftLink } from "./soft-link";

export function CollectionSidebar({ facets }: { facets: CatalogFacets }) {
  const { filters, update } = useCatalogNav();
  const items = [{ id: "all", name: CATALOG_COPY.allCollections, slug: "", count: facets.collectionsTotal }, ...facets.collections];

  return (
    <aside
      aria-labelledby="sidebar-collections"
      className="scroll-minimal hidden lg:block lg:overflow-y-auto lg:p-1"
    >
      <nav aria-label="Collections">
        <ul className="space-y-2.5">
          {items.map((c) => {
            const active = filters.collection === c.slug;
            const disabled = !active && c.count === 0; // tidak ada hasil -> tampil redup, tidak bisa diklik
            const className = cn(
              "flex h-12 w-full items-center justify-between gap-3 rounded-full border px-5 text-[15px] transition",
              active ? "border-black bg-black text-white" : "border-black/20 text-ink/85 hover:bg-white/70",
              disabled && "pointer-events-none opacity-40"
            );
            const label = (
              <>
                <span className="truncate">{c.name}</span>
                <span className={cn("text-xs", active ? "text-white/70" : "text-ink/45")}>{c.count}</span>
              </>
            );
            return (
              <li key={c.id}>
                {disabled ? (
                  <span aria-disabled="true" className={className}>{label}</span>
                ) : (
                  <SoftLink
                    href={buildCatalogHref(filters, { collection: c.slug })}
                    onSelect={() => update({ koleksi: c.slug || null })}
                    aria-current={active ? "true" : undefined}
                    className={className}
                  >
                    {label}
                  </SoftLink>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}