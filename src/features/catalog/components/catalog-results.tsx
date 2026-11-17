"use client";
import { cn } from "@/lib/utils";
import { useCatalogNav } from "./catalog-nav-provider";

/** Meredupkan hasil saat filter sedang dimuat. Mengisi sisa tinggi layar agar grid bisa scroll sendiri. */
export function CatalogResults({ children }: { children: React.ReactNode }) {
  const { pending } = useCatalogNav();
  return (
    <div aria-busy={pending} className={cn("flex min-h-0 flex-1 flex-col transition-opacity duration-200", pending && "pointer-events-none opacity-50")}>
      {children}
    </div>
  );
}