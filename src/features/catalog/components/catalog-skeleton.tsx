import { container } from "@/features/storefront/styles";
import { cn } from "@/lib/utils";

/** Grid yang sama persis dengan ProductGrid, supaya skeleton dan konten tidak bergeser. */
export const CATALOG_GRID =
  "grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-y-7 md:grid-cols-3 md:gap-x-5";

const bone = "animate-pulse bg-cream-deep";

/** Meniru ProductCard: gambar 4/5, kategori, nama, harga. */
export function ProductCardSkeleton() {
  return (
    <div>
      <div className={cn(bone, "aspect-[4/5] rounded-2xl sm:rounded-[1.5rem]")} />
      <div className="pt-2.5 sm:pt-3">
        <div className={cn(bone, "h-3 w-1/3 rounded")} />
        <div className={cn(bone, "mt-2 h-4 w-3/4 rounded sm:h-5")} />
        <div className={cn(bone, "mt-2 h-3.5 w-1/4 rounded")} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn(CATALOG_GRID, className)} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton satu halaman koleksi: judul, tab (HP/tablet), sidebar (desktop), toolbar, grid. */
export function CatalogSkeleton() {
  return (
    <div className={`${container} pb-16 pt-6 md:pb-24 md:pt-10`} aria-busy="true">
      <div className="mx-auto mb-6 flex max-w-2xl flex-col items-center md:mb-10">
        <div className={cn(bone, "h-9 w-64 rounded-full sm:h-10 md:h-12 md:w-96")} />
        <div className={cn(bone, "mt-3 hidden h-4 w-80 rounded sm:block")} />
      </div>

      <div className="mb-4 flex gap-1 overflow-hidden lg:hidden">
        {[88, 72, 96, 80, 84].map((w, i) => (
          <div key={i} className={cn(bone, "h-10 shrink-0 rounded-xl")} style={{ width: w }} />
        ))}
      </div>

      <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div className="hidden space-y-2.5 lg:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={cn(bone, "h-12 w-full rounded-full")} />
          ))}
        </div>

        <div className="min-w-0">
          <div className="mb-6 grid grid-cols-2 gap-2 md:flex md:items-center md:gap-3">
            <div className={cn(bone, "col-span-2 h-10 rounded-full md:flex-1")} />
            <div className={cn(bone, "h-10 rounded-full md:w-56")} />
            <div className={cn(bone, "h-10 rounded-full md:w-60")} />
          </div>
          <div className={cn(bone, "mb-3 h-4 w-40 rounded")} />
          <ProductGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}