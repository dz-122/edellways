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

/** Baris yang bisa digeser horizontal, dengan efek pudar di tepi dan petunjuk geser. */
export function ScrollRow({ children, className, hint, activeKey }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const [touched, setTouched] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
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

  return (
    <div>
      <div className="relative">
        <div
          ref={ref}
          onScroll={(e) => {
            measure();
            if (e.currentTarget.scrollLeft > 8) setTouched(true);
          }}
          className={cn("relative flex snap-x overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}
        >
          {children}
        </div>
        {edges.left && <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-cream to-transparent" />}
        {edges.right && (
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-end bg-gradient-to-l from-cream via-cream/80 to-transparent pr-1">
            <ChevronRight className="size-4 text-forest motion-safe:animate-pulse" />
          </div>
        )}
      </div>
      {hint && edges.right && !touched && (
        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-ink/55 md:hidden">
          {hint} <ArrowRight className="size-3.5 motion-safe:animate-pulse" />
        </p>
      )}
    </div>
  );
}