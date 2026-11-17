import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildCatalogHref } from "@/features/catalog/filters";
import type { CatalogFilters } from "@/features/catalog/types";

type Props = { filters: CatalogFilters; page: number; pageCount: number };

const pill = "inline-flex h-10 items-center gap-1 rounded-full border border-forest/25 px-4 text-sm text-forest transition";

export function CatalogPagination({ filters, page, pageCount }: Props) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Halaman" className="mt-12 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={buildCatalogHref(filters, { page: page - 1 })} className={`${pill} hover:bg-forest hover:text-cream`}>
          <ChevronLeft className="size-4" /> Sebelumnya
        </Link>
      ) : (
        <span aria-disabled className={`${pill} opacity-40`}><ChevronLeft className="size-4" /> Sebelumnya</span>
      )}
      <span className="text-sm text-ink/65">Halaman {page} dari {pageCount}</span>
      {page < pageCount ? (
        <Link href={buildCatalogHref(filters, { page: page + 1 })} className={`${pill} hover:bg-forest hover:text-cream`}>
          Berikutnya <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span aria-disabled className={`${pill} opacity-40`}>Berikutnya <ChevronRight className="size-4" /></span>
      )}
    </nav>
  );
}