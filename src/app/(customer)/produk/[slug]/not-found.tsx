import Link from "next/link";
import { container } from "@/features/storefront/styles";

export default function ProductNotFound() {
  return (
    <div className={`${container} py-28 text-center`}>
      <p className="font-display text-6xl italic text-rose">Oops</p>
      <h1 className="mt-3 font-display text-4xl">Rangkaian ini tidak ditemukan</h1>
      <p className="mt-2 text-ink/65">Mungkin sudah tidak tersedia. Lihat koleksi lainnya ya.</p>
      <Link href="/koleksi" className="mt-8 inline-flex h-12 items-center rounded-full bg-forest px-7 text-cream hover:bg-forest-deep">
        Lihat koleksi
      </Link>
    </div>
  );
}