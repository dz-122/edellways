"use client";
import type { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

type RevealProps = {
  as?: ElementType;
  className?: string;
  delay?: number; // ms
  children: ReactNode;
};

/** Muncul pelan (naik + fade) saat masuk layar. Gaya ada di globals.css ([data-reveal]). */
export function Reveal({ as, className, delay = 0, children }: RevealProps) {
  const Tag = as ?? "div";
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      data-reveal
      data-shown={inView || undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}