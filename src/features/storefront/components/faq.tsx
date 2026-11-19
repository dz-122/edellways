import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "../content";
import { container } from "../styles";
import { SectionHeading } from "./section-heading";

export function Faq() {
  return (
    <section className={`${container} max-w-4xl py-16`}>
      <SectionHeading eyebrow="Sering ditanyakan" title="Pertanyaan" accent="umum" />
      <div className="divide-y divide-forest/15 border-y border-forest/15">
        {FAQ_ITEMS.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl">
              {item.q}
              <ChevronDown className="size-5 shrink-0 text-forest transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 leading-relaxed text-ink/70">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}