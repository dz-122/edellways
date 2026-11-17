import Link from "next/link";
import type { CategoryLink } from "@/features/catalog/types";
import { container } from "../styles";

export function Occasions({ occasions }: { occasions: CategoryLink[] }) {
  const available = occasions.filter((o) => o.count > 0); // hindari halaman hasil kosong
  if (available.length === 0) return null;
  return (
    <section className={`${container} py-14`}>
      <p className="mb-4 text-center font-display text-2xl">Ucapan apa hari ini</p>
      <ul className="flex flex-wrap justify-center gap-2.5">
        {available.map((o) => (
          <li key={o.id}>
            <Link href={`/koleksi?acara=${o.slug}`} className="inline-block rounded-full bg-blush/60 px-5 py-2 text-sm text-forest transition hover:bg-blush">
              {o.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}