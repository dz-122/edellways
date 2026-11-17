import Link from "next/link";
import type { CategoryLink } from "@/features/catalog/types";

const itemClass =
  "flex shrink-0 items-center justify-between gap-3 rounded-full border border-forest/20 px-4 py-1.5 text-sm text-forest transition hover:bg-forest hover:text-cream " +
  "lg:rounded-none lg:border-0 lg:border-b lg:border-forest/10 lg:px-0 lg:py-3 lg:text-base lg:hover:bg-transparent lg:hover:text-rose";

export function CategoryNav({ categories }: { categories: CategoryLink[] }) {
  return (
    <nav aria-label="Kategori produk" className="lg:rounded-[2rem] lg:border lg:border-forest/10 lg:bg-white/60 lg:p-6">
      <p className="mb-2 hidden font-display text-2xl lg:block">Jelajahi</p>
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
        <li className="lg:contents">
          <Link href="/koleksi" className={itemClass}>Semua koleksi</Link>
        </li>
        {categories.map((c) => (
          <li key={c.id} className="lg:contents">
            <Link href={`/koleksi?koleksi=${c.slug}`} className={itemClass}>
              {c.name}
              <span className="text-xs text-ink/45">{c.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}