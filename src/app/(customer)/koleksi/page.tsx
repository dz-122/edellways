import type { Metadata } from "next";
import Link from "next/link";
import { CatalogNavProvider } from "@/features/catalog/components/catalog-nav-provider";
import { CatalogPagination } from "@/features/catalog/components/catalog-pagination";
import { CatalogResults } from "@/features/catalog/components/catalog-results";
import { CatalogToolbar } from "@/features/catalog/components/catalog-toolbar";
import { CollectionSidebar } from "@/features/catalog/components/collection-sidebar";
import { CollectionTabs } from "@/features/catalog/components/collection-tabs";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { ResultsBar } from "@/features/catalog/components/results-bar";
import { CATALOG_COPY } from "@/features/catalog/copy";
import {
  buildCatalogHref,
  parseCatalogFilters,
  parsePage,
} from "@/features/catalog/filters";
import {
  getCatalogFacets,
  getCatalogPage,
  getCatalogTaxonomy,
} from "@/features/catalog/queries";
import { buildCatalogMetadata } from "@/features/catalog/seo";
import { container } from "@/features/storefront/styles";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const taxonomy = await getCatalogTaxonomy();
  return buildCatalogMetadata(parseCatalogFilters(sp), taxonomy, parsePage(sp));
}

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseCatalogFilters(sp);
  const [result, facets] = await Promise.all([
    getCatalogPage(filters, parsePage(sp)),
    getCatalogFacets(filters),
  ]);
  const storageKey = buildCatalogHref(filters, { page: result.page });

  return (
  // Tinggi = layar dikurangi header situs (65px). Semua yang di sini diam, hanya ProductGrid yang bergulir.
  <div className={`${container} flex h-[calc(100dvh-4.0625rem)] flex-col pb-4 pt-4 md:pb-6 md:pt-6`}>
    <header className="mx-auto mb-3 max-w-2xl shrink-0 text-center md:mb-5">
      <h1 className="font-display text-2xl leading-tight sm:text-4xl md:text-5xl">
        Our Floral <em className="italic text-black">Collection</em>
      </h1>
      <p className="mt-2 hidden text-balance text-ink/70 sm:block sm:text-base">
        Explore our signature arrangements, where every detail is designed with intention.
      </p>
    </header>

    <CatalogNavProvider filters={filters}>
      <div className="mb-3 shrink-0 lg:hidden">
        <CollectionTabs facets={facets} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-10">
        <CollectionSidebar facets={facets} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <CatalogToolbar facets={facets} />
          <ResultsBar total={result.totalCount} /> {/* diam, tidak ikut bergulir */}

          <CatalogResults>
            {result.rows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-black/25 px-6 py-14 text-center">
                <p className="font-display text-xl sm:text-2xl">{CATALOG_COPY.empty}</p>
                <Link href="/koleksi" className="mt-4 inline-flex h-10 items-center rounded-full bg-black px-5 text-sm text-white hover:bg-black/80">
                  {CATALOG_COPY.emptyCta}
                </Link>
              </div>
            ) : (
              <ProductGrid
                key={storageKey}
                initialRows={result.rows}
                initialPage={result.page}
                pageCount={result.pageCount}
                totalCount={result.totalCount}
                filters={filters}
                storageKey={storageKey}
              />
            )}
          </CatalogResults>

          <noscript>
            <CatalogPagination filters={filters} page={result.page} pageCount={result.pageCount} />
          </noscript>
        </div>
      </div>
    </CatalogNavProvider>
  </div>
);
}
