import { container } from "@/features/storefront/styles";

export default function CollectionLoading() {
  return (
    <div className={`${container} py-6 md:py-10`} aria-busy="true">
      <div className="mb-6 h-12 w-56 animate-pulse rounded-full bg-cream-deep" />
      <div className="mb-6 h-10 animate-pulse rounded-full bg-cream-deep" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] animate-pulse rounded-[1.5rem] bg-cream-deep" />
            <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-cream-deep" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-cream-deep" />
          </div>
        ))}
      </div>
    </div>
  );
}