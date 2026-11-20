"use client";
import { Fragment } from "react";
import { useInView } from "@/hooks/use-in-view";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number; // ms sebelum kata pertama
  step?: number; // jeda antar kata (ms)
};

/** Judul yang muncul kata demi kata. Teks tetap utuh di HTML, jadi aman untuk SEO dan screen reader. */
export function SplitText({ text, className, delay = 0, step = 80 }: SplitTextProps) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const words = text.split(" ");
  return (
    <span ref={ref} data-split data-shown={inView || undefined} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span data-word className="inline-block" style={{ transitionDelay: `${delay + i * step}ms` }}>
            {word}
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}