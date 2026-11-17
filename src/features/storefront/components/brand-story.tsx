import { STORY } from "../content";
import { container } from "../styles";
import { BotanicalSprig } from "./botanical";

export function BrandStory() {
  return (
    <section id="cerita" className={`${container} grid items-center gap-12 py-20 lg:grid-cols-2`}>
      <div className="relative mx-auto h-[26rem] w-full max-w-md">
        <div className="absolute inset-x-8 top-0 h-full rounded-t-full bg-blush" />
        <div className="absolute bottom-0 left-0 grid h-48 w-40 place-items-center rounded-[2rem] bg-forest">
          <BotanicalSprig className="h-32 text-cream/70" />
        </div>
        <BotanicalSprig className="absolute right-4 top-12 h-72 text-forest/60" />
      </div>
      <div>
        <p className="mb-2 font-display text-lg italic text-rose">Tentang kami</p>
        <h2 className="font-display text-4xl leading-tight md:text-5xl">
          {STORY.title} <em className="italic text-forest">{STORY.accent}</em>
        </h2>
        <div className="mt-5 space-y-4 text-ink/75">
          {STORY.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
        <dl className="mt-8 grid gap-6 sm:grid-cols-3">
          {STORY.values.map((v) => (
            <div key={v.title} className="border-l-2 border-rose/60 pl-4">
              <dt className="font-display text-xl">{v.title}</dt>
              <dd className="mt-1 text-sm text-ink/65">{v.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}