import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SITE } from "@/config/site";

export function Hero() {
  return (
    <section className="relative h-[calc(100svh-4rem)] min-h-[420px] max-h-[650px] w-full overflow-hidden bg-black">
      <h1 className="sr-only">Toko Bunga Ambon: Buket Bunga, Hampers & Gift Box Edellways</h1>
      <div className="absolute inset-0 scale-[2.1] min-[480px]:scale-[1.6] sm:scale-100">
        <Image
          src="/images/logo.webp"
          alt={`Logo ${SITE.name}, toko bunga dan greeting gift di ${SITE.city}`}
          fill
          priority
          sizes="100vw"
          className="hero-in object-contain object-center sm:object-cover"
        />
      </div>
      <div className="rise-in absolute inset-x-0 bottom-8 flex flex-col items-center gap-4 sm:bottom-10">
        <Link
          href="/koleksi"
          className="inline-flex h-11 items-center rounded-full bg-gold px-7 text-sm font-medium text-black transition hover:bg-gold-soft"
        >
          Lihat Koleksi
        </Link>
        <ChevronDown aria-hidden className="size-5 text-gold/70 motion-safe:animate-bounce" />
      </div>
    </section>
  );
}