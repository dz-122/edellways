import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATALOG_COPY } from "../copy";
import { buildCatalogHref } from "../filters";
import type { CatalogFilters } from "../types";

type Props = { filters: CatalogFilters; page: number; pageCount: number };

const base = "inline-flex h-10 items-center gap-1 rounded-full border border-forest/25 px-4 text-sm text-forest transition";

export function CatalogPagination({ filters, page, pageCount }: Props) {
  if (pageCount <= 1) return null;
  const prev = <><ChevronLeft className="size-4" /> <span className="max-sm:sr-only">{CATALOG_COPY.previous}</span></>;
  const next = <><span className="max-sm:sr-only">{CATALOG_COPY.next}</span> <ChevronRight className="size-4" /></>;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={buildCatalogHref(filters, { page: page - 1 })} rel="prev" className={`${base} hover:bg-forest hover:text-cream`}>{prev}</Link>
      ) : (
        <span aria-disabled className={`${base} opacity-40`}>{prev}</span>
      )}
      <span className="text-sm text-ink/65">{page} / {pageCount}</span>
      {page < pageCount ? (
        <Link href={buildCatalogHref(filters, { page: page + 1 })} rel="next" className={`${base} hover:bg-forest hover:text-cream`}>{next}</Link>
      ) : (
        <span aria-disabled className={`${base} opacity-40`}>{next}</span>
      )}
    </nav>
  );
}