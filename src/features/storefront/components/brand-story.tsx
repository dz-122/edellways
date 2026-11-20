import { Reveal } from "@/components/shared/reveal";
import { SplitText } from "@/components/shared/split-text";
import { SITE } from "@/config/site";
import { ABOUT } from "../content";
import { container } from "../styles";

type Group = typeof ABOUT.daily;

function OccasionIndex({ group }: { group: Group }) {
  return (
    <div>
      <Reveal as="h4" className="font-display text-2xl italic text-gold">
        {group.title}
      </Reveal>
      <ol className="mt-4 border-t border-gold/30">
        {group.items.map((item, i) => (
          <Reveal
            as="li"
            key={item}
            delay={i * 60}
            className="group flex items-baseline gap-4 border-b border-cream/10 py-3.5"
          >
            <span className="w-7 shrink-0 font-display text-sm tabular-nums text-gold/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[15px] text-cream/85 transition-colors duration-300 group-hover:text-gold-soft sm:text-base">
              {item}
            </span>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

export function BrandStory() {
  const titleWords = ABOUT.title.split(" ").length;

  return (
    <section
      id="cerita"
      aria-labelledby="about-heading"
      className="relative isolate overflow-hidden bg-black text-cream"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(212,175,106,0.16),transparent_70%)]"
      />

      <div className={`${container} py-24 md:py-32`}>
        <header className="mx-auto max-w-4xl text-center">
          <Reveal
            as="p"
            className="text-xs uppercase tracking-[0.35em] text-gold"
          >
            {ABOUT.eyebrow}
          </Reveal>
          <h2
            id="about-heading"
            className="mt-5 text-balance font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl"
          >
            <SplitText text={ABOUT.title} />{" "}
            <SplitText
              text={ABOUT.accent}
              delay={titleWords * 80}
              className="italic text-gold-soft"
            />
          </h2>
          <Reveal as="p" delay={400} className="mt-4 text-sm text-cream/55">
            Toko bunga di {SITE.city} · {SITE.serviceAreas.join(", ")}
          </Reveal>
        </header>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2 md:gap-12">
          {ABOUT.intro.map((p, i) => (
            <Reveal
              key={p}
              delay={i * 150}
              className="border-t border-gold/40 pt-5"
            >
              <p className="leading-relaxed text-cream/80">{p}</p>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-5xl">
          <div className="text-center">
            <Reveal
              as="h3"
              className="text-balance font-display text-3xl md:text-4xl"
            >
              {ABOUT.occasionsTitle}
            </Reveal>
            <Reveal
              as="p"
              delay={120}
              className="mx-auto mt-3 max-w-xl text-cream/70"
            >
              {ABOUT.occasionsText}
            </Reveal>
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-20">
            <OccasionIndex group={ABOUT.daily} />
            <OccasionIndex group={ABOUT.seasonal} />
          </div>
        </div>

        <div
          aria-hidden
          className="mx-auto mt-16 flex max-w-xs items-center gap-4 text-gold/70"
        >
          <span className="h-px flex-1 bg-gold/30" />
          ✿
          <span className="h-px flex-1 bg-gold/30" />
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          {ABOUT.outro.map((p, i) => (
            <Reveal
              as="p"
              key={p}
              delay={i * 120}
              className="mt-3 text-cream/75 first:mt-0"
            >
              {p}
            </Reveal>
          ))}
          <Reveal delay={200} className="mt-12">
            <p className="font-brand color-brand text-5xl  sm:text-7xl text-cream">
              Edellways
            </p>
            <p className="text-sm text-gold sm:text-md mt-3">
              {ABOUT.closing[0]}
            </p>
            <p className="mt-3 font-display text-lg italic text-cream/70 sm:text-xl">
              {ABOUT.closing[1]}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
