import { PERKS } from "../content";

export function PerksMarquee() {
  const row = [...PERKS, ...PERKS];
  return (
    <div className="overflow-hidden border-y border-forest/15 py-4" aria-label="Keunggulan Edellways">
      <ul className="flex w-max animate-marquee gap-12 font-display text-xl italic text-forest">
        {[...row, ...row].map((perk, i) => (
          <li key={i} aria-hidden={i >= PERKS.length} className="flex items-center gap-12 whitespace-nowrap">
            {perk} <span className="text-rose">✿</span>
          </li>
        ))}
      </ul>
    </div>
  );
}