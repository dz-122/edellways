import { cn } from "@/lib/utils";

const BULB_COLORS = ["#e0314b", "#f3c969", "#3fbf7f", "#ffffff"];

/** Untaian lampu hias yang berkelap-kelip. Di HP hanya separuh lampu yang tampil. */
export function Garland() {
  return (
    <div aria-hidden className="pointer-events-none relative z-10 h-9">
      <div className="absolute inset-x-0 top-1.5 h-px bg-black/50" />
      <ul className="relative flex justify-between px-3 sm:px-6">
        {Array.from({ length: 22 }, (_, i) => {
          const color = BULB_COLORS[i % BULB_COLORS.length];
          return (
            <li key={i} className={cn("flex-col items-center", i >= 11 ? "hidden sm:flex" : "flex")}>
              <span className="h-1.5 w-1.5 bg-zinc-700" />
              <span
                className="bulb h-4 w-3 rounded-b-full rounded-t-md"
                style={{ background: color, boxShadow: `0 0 12px 3px ${color}99`, animationDelay: `${((i * 37) % 24) / 10}s` }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const ORNAMENTS = [
  { left: "6%", drop: 58, size: 34, from: "#e0314b", to: "#7d1224", wide: false },
  { left: "21%", drop: 96, size: 28, from: "#f6e2a0", to: "#a8812f", wide: true },
  { left: "79%", drop: 84, size: 30, from: "#f6e2a0", to: "#a8812f", wide: true },
  { left: "93%", drop: 64, size: 36, from: "#e0314b", to: "#7d1224", wide: false },
];

/** Bola Natal yang menggantung dan bergoyang pelan. */
export function Ornaments() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40">
      {ORNAMENTS.map((o, i) => (
        <div key={i} className={cn("ornament absolute top-0 flex flex-col items-center", o.wide && "hidden lg:flex")} style={{ left: o.left, animationDelay: `${i * 0.6}s` }}>
          <span className="w-px bg-gold/50" style={{ height: o.drop }} />
          <span className="h-1.5 w-3 rounded-sm bg-gold" />
          <span
            className="rounded-full shadow-lg shadow-black/30"
            style={{ width: o.size, height: o.size, background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,.75), ${o.from} 38%, ${o.to})` }}
          />
        </div>
      ))}
    </div>
  );
}