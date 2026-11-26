"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { CartButton } from "@/features/cart/components/cart-button";
import { NAV_LINKS } from "../content";
import { container } from "../styles";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Tutup dengan tombol Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-cream/85 backdrop-blur">
      <div className={`${container} flex h-16 items-center justify-between`}>
        <Link
          href="/"
          className="font-brand text-3xl tracking-tight text-forest"
        >
          Edellways
        </Link>
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-9 text-sm md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink/75 transition hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <CartButton />
          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full text-forest transition active:scale-90 md:hidden"
          >
            <span className="relative block size-5">
              <Menu
                className={`absolute inset-0 size-5 transition duration-300 motion-reduce:transition-none ${
                  open ? "rotate-90 scale-50 opacity-0" : ""
                }`}
              />
              <X
                className={`absolute inset-0 size-5 transition duration-300 motion-reduce:transition-none ${
                  open ? "" : "-rotate-90 scale-50 opacity-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Overlay (absolute) supaya tidak mendorong konten dan posisi scroll ke #id tidak meleset.
          Selalu dirender agar bisa dianimasikan; `inert` saat tertutup agar link tidak bisa difokus. */}
      <div
        id="mobile-nav"
        inert={!open}
        className={`absolute inset-x-0 top-full grid bg-cream transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav
            aria-label="Navigasi seluler"
            className="border-y border-forest/10 shadow-[0_18px_30px_-20px_rgba(0,0,0,0.25)]"
          >
            <ul className={`${container} py-2`}>
              {NAV_LINKS.map((link, i) => (
                <li
                  key={link.href}
                  style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
                  className={`transition duration-300 ease-out motion-reduce:transition-none ${
                    open
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-2 opacity-0"
                  }`}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-forest/10 py-3.5 font-body text-[17px] font-medium tracking-tight text-ink transition-colors last:border-b-0 hover:text-forest active:bg-cream-deep/60"
                  >
                    {link.label}
                    <ChevronRight aria-hidden className="size-4 text-ink/30" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
