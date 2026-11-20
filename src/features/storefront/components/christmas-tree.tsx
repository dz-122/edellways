import { cn } from "@/lib/utils";

const COLORS = {
  red: ["#ff7a8a", "#e0314b", "#8f1128"],
  gold: ["#fff1c2", "#f3c969", "#a8812f"],
  blue: ["#a9d4ff", "#3b82f6", "#1d4ba8"],
  pink: ["#ffd0e6", "#f472b6", "#a8326f"],
  silver: ["#ffffff", "#d4d9de", "#7b8793"],
} as const;

type ColorKey = keyof typeof COLORS;
const ORDER: ColorKey[] = ["red", "gold", "blue", "pink", "silver"];

// x, y, jari-jari, indeks warna. Semua posisi berada di dalam tingkat daun.
const BALLS: [number, number, number, number][] = [
  [100, 70, 4.5, 2], [89, 88, 5.5, 0], [112, 94, 5, 1],
  [100, 110, 5, 3], [78, 130, 6.5, 2], [126, 122, 5.5, 1], [106, 142, 7, 0], [86, 158, 6, 3], [124, 160, 6.5, 4],
  [66, 182, 6.5, 4], [132, 186, 6, 3], [100, 194, 7.5, 1], [70, 206, 8, 0], [132, 208, 8, 2],
  [50, 232, 8, 1], [84, 230, 7, 3], [118, 234, 8, 0], [152, 230, 7.5, 3],
];

const LIGHTS: [number, number][] = [
  [70, 104], [132, 100], [52, 160], [150, 160], [34, 232], [168, 232],
  [100, 52], [88, 122], [114, 176], [74, 200], [150, 214], [100, 246],
];
const LIGHT_COLORS = ["#ff5c75", "#ffe08a", "#7cc7ff", "#ffffff"];

type ChristmasTreeProps = {
  id: string; // unik per pohon (dipakai untuk gradien SVG)
  variant?: "a" | "b"; // b = urutan warna bola digeser agar tidak kembar
  className?: string;
};

/** Pohon Natal SVG: bintang bercahaya, bola warna-warni, lampu berkelap-kelip, dan kado. */
export function ChristmasTree({ id, variant = "a", className }: ChristmasTreeProps) {
  const shift = variant === "b" ? 2 : 0;

  return (
    <svg aria-hidden viewBox="0 0 200 284" className={cn("h-auto", className)} fill="none">
      <defs>
        {ORDER.map((key) => (
          <radialGradient key={key} id={`${id}-${key}`} cx="30%" cy="28%" r="80%">
            <stop offset="0" stopColor={COLORS[key][0]} />
            <stop offset="0.45" stopColor={COLORS[key][1]} />
            <stop offset="1" stopColor={COLORS[key][2]} />
          </radialGradient>
        ))}
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f9a63" />
          <stop offset="1" stopColor="#12553a" />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* cahaya bintang */}
      <circle className="star-glow" cx="100" cy="30" r="30" fill={`url(#${id}-halo)`} />

      {/* batang dan tingkat daun (dari bawah ke atas) */}
      <rect x="89" y="244" width="22" height="28" rx="2" fill="#5b3a21" />
      <g stroke="#0b3d26" strokeWidth="1" strokeLinejoin="round" fill={`url(#${id}-leaf)`}>
        <path d="M100 124 L18 244 Q100 262 182 244 Z" />
        <path d="M100 78 L42 172 Q100 186 158 172 Z" />
        <path d="M100 38 L62 110 Q100 122 138 110 Z" />
      </g>

      {/* lilitan manik emas */}
      <g stroke="#f1e0b0" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="0.1 5.5">
        <path d="M32 226 Q100 250 168 226" />
        <path d="M54 156 Q100 176 146 156" />
        <path d="M72 98 Q100 112 128 98" />
      </g>

      {/* bintang */}
      <path
        d="M100 12 L104.41 23.93 L117.12 24.44 L107.13 32.32 L110.58 44.56 L100 37.5 L89.42 44.56 L92.87 32.32 L82.88 24.44 L95.59 23.93 Z"
        fill="#f6d36b"
        stroke="#fff1c2"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* bola Natal */}
      {BALLS.map(([x, y, r, c], i) => {
        const key = ORDER[(c + shift) % ORDER.length];
        return (
          <g key={i}>
            <rect x={x - 1.6} y={y - r - 2.6} width="3.2" height="3" rx="0.6" fill="#d4af6a" />
            <circle cx={x} cy={y} r={r} fill={`url(#${id}-${key})`} />
            <circle cx={x - r * 0.35} cy={y - r * 0.4} r={r * 0.22} fill="#fff" opacity="0.85" />
          </g>
        );
      })}

      {/* lampu berkelap-kelip */}
      {LIGHTS.map(([x, y], i) => {
        const color = LIGHT_COLORS[(i + shift) % LIGHT_COLORS.length];
        return (
          <g key={i} className="bulb" style={{ animationDelay: `${((i * 37) % 24) / 10}s` }}>
            <circle cx={x} cy={y} r="4.6" fill={color} opacity="0.35" />
            <circle cx={x} cy={y} r="2.2" fill={color} />
          </g>
        );
      })}

      {/* salju dan kado */}
      <ellipse cx="100" cy="274" rx="86" ry="8" fill="#fff" opacity="0.96" />

      <g>
        <rect x="44" y="250" width="28" height="24" rx="2" fill="#c21f3a" />
        <rect x="56" y="250" width="4" height="24" fill="#f3c969" />
        <rect x="44" y="259" width="28" height="4" fill="#f3c969" />
        <ellipse cx="52" cy="248" rx="6" ry="3.4" transform="rotate(-20 52 248)" fill="#f3c969" />
        <ellipse cx="64" cy="248" rx="6" ry="3.4" transform="rotate(20 64 248)" fill="#f3c969" />
      </g>
      <g>
        <rect x="128" y="254" width="26" height="20" rx="2" fill="#f3c969" />
        <rect x="139" y="254" width="4" height="20" fill="#c21f3a" />
        <rect x="128" y="262" width="26" height="4" fill="#c21f3a" />
        <ellipse cx="136" cy="252" rx="5.5" ry="3" transform="rotate(-20 136 252)" fill="#c21f3a" />
        <ellipse cx="146" cy="252" rx="5.5" ry="3" transform="rotate(20 146 252)" fill="#c21f3a" />
      </g>
      <g>
        <rect x="158" y="262" width="18" height="12" rx="1.6" fill="#3b82f6" />
        <rect x="165.5" y="262" width="3" height="12" fill="#fff" />
        <rect x="158" y="267" width="18" height="2.6" fill="#fff" />
      </g>
    </svg>
  );
}