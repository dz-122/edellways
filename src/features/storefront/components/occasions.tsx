
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { container } from "../styles";

const categories = [
  { name: "Bouquet", slug: "bouquet" },
  { name: "Hampers", slug: "hampers" },
  { name: "Giftbox", slug: "giftbox" },
];

export function Occasions() {
  return (
    <section className="bg-white">
      <div className={`${container} py-14 md:py-16`}>
        <Reveal
          as="p"
          className="mb-6 text-center font-display text-2xl md:text-3xl"
        >
          Temukan Hadiah Istimewa
        </Reveal>

        <ul className="flex flex-wrap justify-center gap-2.5">
          {categories.map((category, i) => (
            <Reveal as="li" key={category.slug} delay={i * 50}>
              <Link
                href={`/koleksi?kategori=${category.slug}`}
                className="inline-block rounded-full border border-forest/25 px-5 py-2 text-sm text-forest transition hover:border-forest hover:bg-forest hover:text-cream"
              >
                {category.name}
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
