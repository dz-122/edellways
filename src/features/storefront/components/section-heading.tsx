import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  href?: string;
  linkLabel?: string;
  tone?: "light" | "dark";
};

export function SectionHeading({
  eyebrow,
  title,
  accent,
  href,
  linkLabel = "Lihat semua",
  tone = "light",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <Reveal className="mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-10">
      <div>
        {eyebrow && (
          <p
            className={`mb-2 font-display text-lg italic ${dark ? "text-gold-soft" : "text-gold-deep"}`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={`font-display text-3xl leading-tight sm:text-4xl md:text-5xl ${dark ? "text-cream" : "text-ink"}`}
        >
          {title}{" "}
          {accent && (
            <em className={`italic ${dark ? "text-gold-soft" : "text-forest"}`}>
              {accent}
            </em>
          )}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className={`inline-flex items-center gap-1 border-b pb-0.5 text-sm font-medium max-sm:hidden ${dark ? "border-cream/40 text-cream" : "border-forest/40 text-forest"}`}
        >
          {linkLabel} <ArrowUpRight className="size-4" />
        </Link>
      )}
    </Reveal>
  );
}
