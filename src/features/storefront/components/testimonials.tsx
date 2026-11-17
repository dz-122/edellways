import { TESTIMONIALS } from "../content";
import { container } from "../styles";
import { SectionHeading } from "./section-heading";

export function Testimonials() {
  return (
    <section className="bg-blush/40 py-16">
      <div className={container}>
        <SectionHeading eyebrow="Kata mereka" title="Cerita dari" accent="pelanggan" />
        <ul className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <li key={i} className="flex flex-col rounded-[1.5rem] bg-cream p-7">
              <span aria-hidden className="font-display text-6xl leading-none text-rose">“</span>
              <p className="-mt-2 flex-1 font-display text-xl leading-snug">{t.text}</p>
              <p className="mt-5 text-sm text-ink/60">{t.name} · {t.occasion}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}