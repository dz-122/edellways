import { Reveal } from "@/components/shared/reveal";
import { TESTIMONIALS } from "../content";
import { container } from "../styles";
import { SectionHeading } from "./section-heading";

export function Testimonials() {
  return (
    <section className="border-t border-black/5 bg-white py-12 sm:py-16 md:py-20">
      <div className={container}>
        <SectionHeading eyebrow="Kata mereka" title="Cerita dari" accent="pelanggan" />
        <Reveal>
          <ul className="-mx-4 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] md:-mx-6 md:scroll-pl-6 md:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
            {TESTIMONIALS.map((t, i) => (
              <li
                key={i}
                className="flex w-[82%] shrink-0 snap-start flex-col rounded-[1.5rem] border border-gold/40 bg-white p-6 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)] sm:w-[56%] sm:p-7 lg:w-auto"
              >
                <span aria-hidden className="font-display text-5xl leading-none text-gold sm:text-6xl">“</span>
                <p className="-mt-1 flex-1 font-display text-lg leading-snug sm:-mt-2 sm:text-xl">{t.text}</p>
                <p className="mt-5 text-sm text-ink/60">{t.name} · {t.occasion}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}