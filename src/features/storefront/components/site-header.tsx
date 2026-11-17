"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CartButton } from "@/features/cart/components/cart-button";
import { NAV_LINKS } from "../content";
import { container } from "../styles";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-cream/85 backdrop-blur">
      <div className={`${container} flex h-16 items-center justify-between`}>
        <Link href="/" className="font-brand text-3xl tracking-tight text-forest">
          Edellways
        </Link>
        <nav aria-label="Navigasi utama" className="hidden items-center gap-9 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink/75 transition hover:text-forest">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <CartButton />
          <button type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="grid size-10 place-items-center rounded-full text-forest md:hidden">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Navigasi seluler" className="border-t border-forest/10 bg-cream md:hidden">
          <ul className={`${container} py-2`}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)} className="block border-b border-forest/10 py-3 font-display text-xl last:border-0">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}