import { STEPS } from "../content";
import { container } from "../styles";
import { SectionHeading } from "./section-heading";

export function HowToOrder() {
  return (
    <section id="cara-pesan" className="bg-cream-deep py-16">
      <div className={container}>
        <SectionHeading eyebrow="Mudah sekali" title="Pesan dalam" accent="empat langkah" />
        <ol className="grid gap-8 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-t border-forest/25 pt-5">
              <span className="font-display text-5xl italic text-rose">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}