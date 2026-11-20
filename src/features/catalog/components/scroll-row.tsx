"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  hint?: string; // teks petunjuk geser (hanya di HP)
  activeKey?: string; // saat berubah, item aktif dipusatkan
};

const FADE = "2rem";

export function ScrollRow({ children, className, hint, activeKey }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const [touched, setTouched] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setEdges((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  // Pusatkan item aktif (saat dibuka dan saat pilihan berubah).
  useEffect(() => {
    const el = ref.current;
    const active = el?.querySelector<HTMLElement>('[aria-current="true"], [aria-pressed="true"]');
    if (!el || !active) return;
    const left = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [activeKey]);

  const { left, right } = edges;
  const mask =
    left && right
      ? `linear-gradient(to right, transparent, #000 ${FADE}, #000 calc(100% - ${FADE}), transparent)`
      : left
        ? `linear-gradient(to right, transparent, #000 ${FADE})`
        : right
          ? `linear-gradient(to right, #000 calc(100% - ${FADE}), transparent)`
          : undefined;

  return (
    <div>
      <div className="relative">
        <div
          ref={ref}
          onScroll={(e) => {
            measure();
            if (e.currentTarget.scrollLeft > 8) setTouched(true);
          }}
          style={{ maskImage: mask, WebkitMaskImage: mask }}
          className={cn(
            "flex overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            className,
          )}
        >
          {children}
        </div>
        {right && (
          <ChevronRight
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-black motion-safe:animate-pulse"
          />
        )}
      </div>
      {hint && right && !touched && (
        <p className="mt-1.5 flex items-center justify-center gap-1 text-xs text-ink/50 md:hidden">
          {hint} <ArrowRight className="size-3.5 motion-safe:animate-pulse" />
        </p>
      )}
    </div>
  );
}