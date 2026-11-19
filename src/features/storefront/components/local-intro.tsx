import { SITE } from "@/config/site";
import { LOCAL_INTRO } from "../content";
import { container } from "../styles";
import { SectionHeading } from "./section-heading";

export function LocalIntro() {
  return (
    <section className={`${container} py-16`}>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading eyebrow={`Florist ${SITE.city}`} title={LOCAL_INTRO.title} accent={LOCAL_INTRO.accent} />
          <div className="space-y-4 text-ink/75">
            {LOCAL_INTRO.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
        <div className="rounded-[2rem] bg-blush/40 p-7">
          <h3 className="font-display text-2xl">Area layanan di {SITE.city}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SITE.serviceAreas.map((area) => (
              <li key={area} className="rounded-full bg-cream px-4 py-1.5 text-sm text-forest">{area}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink/65">Biaya dan jadwal pengiriman dikonfirmasi admin lewat WhatsApp.</p>
        </div>
      </div>
    </section>
  );
}