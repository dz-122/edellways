import { cn } from "@/lib/utils";

/** Salju CSS murni. Posisi deterministik (bukan acak) agar tidak ada selisih render server/klien. */
export function Snow({ count = 24, className }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: count }, (_, i) => {
        const size = 2 + ((i * 5) % 5);
        const style = {
          left: `${(i * 37) % 100}%`,
          width: size,
          height: size,
          "--dur": `${9 + ((i * 7) % 9)}s`,
          "--delay": `-${(i * 3) % 12}s`,
          "--sway": `${3 + (i % 4)}s`,
        } as React.CSSProperties;
        return <span key={i} className="snowflake" style={style} />;
      })}
    </div>
  );
}