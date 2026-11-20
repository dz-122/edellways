import { Reveal } from "@/components/shared/reveal";
import { STEPS } from "../content";
import { container } from "../styles";
import { SectionHeading } from "./section-heading";

export function HowToOrder() {
  return (
    <section id="cara-pesan" className="bg-white py-12 sm:py-16 md:py-20">
      <div className={container}>
        <SectionHeading eyebrow="Mudah sekali" title="Pesan dalam" accent="empat langkah" />
        <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 100}
              className="flex gap-4 border-t border-gold/60 pt-5 sm:block"
            >
              <span className="w-11 shrink-0 font-display text-4xl italic leading-none text-forest sm:w-auto sm:text-5xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-xl leading-snug sm:mt-3 sm:text-2xl">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70 sm:mt-2">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}