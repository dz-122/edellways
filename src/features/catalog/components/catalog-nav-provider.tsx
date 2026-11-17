"use client";
import { createContext, useContext, useMemo } from "react";
import { useUrlParams } from "@/hooks/use-url-params";
import type { CatalogFilters } from "../types";

type CatalogNav = {
  filters: CatalogFilters;
  update: (patch: Record<string, string | null>) => void;
  clearFilters: () => void; // koleksi, acara, tersedia
  clearAll: () => void; // + pencarian
  pending: boolean;
};

const Ctx = createContext<CatalogNav | null>(null);

/** Satu sumber status navigasi untuk toolbar, filter, chip, dan area hasil. */
export function CatalogNavProvider({
  filters,
  children,
}: {
  filters: CatalogFilters;
  children: React.ReactNode;
}) {
  const { update, pending } = useUrlParams();
  const value = useMemo<CatalogNav>(
    () => ({
      filters,
      update,
      pending,
      clearFilters: () =>
        update({ koleksi: null, acara: null, tersedia: null }),
      clearAll: () =>
        update({ q: null, koleksi: null, acara: null, tersedia: null }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, pending],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalogNav(): CatalogNav {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useCatalogNav harus dipakai di dalam <CatalogNavProvider>.",
    );
  return ctx;
}
