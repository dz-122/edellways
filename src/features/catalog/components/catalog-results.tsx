"use client";
import { cn } from "@/lib/utils";
import { useCatalogNav } from "./catalog-nav-provider";

export function CatalogResults({ children }: { children: React.ReactNode }) {
  const { pending } = useCatalogNav();
  return (
    <div aria-busy={pending} className={cn("transition-opacity duration-200", pending && "pointer-events-none opacity-50")}>
      {children}
    </div>
  );
}