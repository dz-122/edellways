"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { ProductCard } from "@/features/storefront/components/product-card";
import { cn } from "@/lib/utils";
import { loadMoreProducts } from "../actions";
import { CATALOG_COPY } from "../copy";
import type { CatalogFilters, CatalogProduct } from "../types";

const GRID =
  "grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-y-7 md:grid-cols-3 md:gap-x-5";
const RESTORE_FLAG = "edw:catalog:restore";

type Status = "idle" | "loading" | "error";
type Snapshot = {
  items: CatalogProduct[];
  page: number;
  pages: number;
  scrollY: number;
};

type Props = {
  initialRows: CatalogProduct[];
  initialPage: number;
  pageCount: number;
  totalCount: number;
  filters: CatalogFilters;
  storageKey: string; // unik per kombinasi filter
};

/** Satu-satunya area yang bergulir di halaman katalog. */
export function ProductGrid({
  initialRows,
  initialPage,
  pageCount,
  totalCount,
  filters,
  storageKey,
}: Props) {
  const cacheKey = `edw:catalog:${storageKey}`;
  const [items, setItems] = useState(initialRows);
  const [page, setPage] = useState(initialPage);
  const [pages, setPages] = useState(pageCount);
  const [status, setStatus] = useState<Status>("idle");
  const loading = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const hasMore = page < pages;

  // Kembali dari halaman produk: pulihkan daftar yang sudah dimuat dan posisi scroll.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(RESTORE_FLAG) !== cacheKey) return;
      sessionStorage.removeItem(RESTORE_FLAG);
      const snap: Snapshot = JSON.parse(
        sessionStorage.getItem(cacheKey) ?? "null",
      );
      if (
        !snap ||
        snap.items[0]?.id !== initialRows[0]?.id ||
        snap.page <= initialPage
      )
        return;
      setItems(snap.items);
      setPage(snap.page);
      setPages(snap.pages);
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          window.scrollTo({ top: snap.scrollY, behavior: "instant" }),
        ),
      );
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNext = useCallback(async () => {
    if (loading.current || page >= pages) return;
    loading.current = true;
    setStatus("loading");
    try {
      const res = await loadMoreProducts(filters, page + 1);
      if (!res) throw new Error("invalid");
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id)); // cegah duplikat jika data berubah di tengah jalan
        return [...prev, ...res.rows.filter((r) => !seen.has(r.id))];
      });
      setPage(res.page);
      setPages(res.pageCount);
      setStatus("idle");
    } catch {
      setStatus("error");
    } finally {
      loading.current = false;
    }
  }, [filters, page, pages]);

  // observer: tanpa root
  useEffect(() => {
    const el = sentinel.current;
    if (!el || status !== "idle" || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadNext(),
      { rootMargin: "800px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadNext, status, hasMore]);

  // Simpan daftar + posisi scroll sebelum pindah ke halaman produk.
  const saveSnapshot = () => {
    try {
      const snap: Snapshot = {
        items,
        page,
        pages,
        scrollY: window.scrollY,
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(snap));
      sessionStorage.setItem(RESTORE_FLAG, cacheKey);
    } catch {}
  };

  return (
    <div
      role="region"
      aria-label="Arrangements"
      onClickCapture={(e) =>
        (e.target as HTMLElement).closest('a[href^="/produk/"]') &&
        saveSnapshot()
      }
    >
      <div className={GRID}>
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {status === "loading" && (
        <>
          <p role="status" className="sr-only">
            {CATALOG_COPY.loadingMore}
          </p>
          <div className={cn(GRID, "mt-6 sm:mt-7")} aria-hidden>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/5] animate-pulse rounded-2xl bg-cream-deep sm:rounded-[1.5rem]" />
                <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-cream-deep" />
                <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-cream-deep" />
              </div>
            ))}
          </div>
        </>
      )}

      {hasMore && status === "idle" && (
        <div ref={sentinel} aria-hidden className="h-px" />
      )}

      {status === "error" && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={loadNext}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-forest/25 px-5 text-sm text-forest hover:bg-forest/5"
          >
            <Loader2 className="size-4" /> {CATALOG_COPY.retry}
          </button>
        </div>
      )}

      {!hasMore && pages > 1 && (
        <p className="mt-10 text-center text-sm text-ink/50">
          {CATALOG_COPY.endOfList(totalCount)}
        </p>
      )}
    </div>
  );
}
