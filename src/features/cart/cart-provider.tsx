"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { calculateOrder, type OrderTotals } from "@/features/transactions/calculations";
import type { CartItem } from "./types";

const STORAGE_KEY = "edellways:cart";
const MAX_QTY = 99;

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  totals: OrderTotals; // subtotal + PPN + total, dihitung dari satu fungsi yang sama dengan kasir
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  /** Menambah produk dan mengembalikan total keranjang terbaru (sudah termasuk PPN). */
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => OrderTotals;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  replaceAll: (items: CartItem[]) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const totalsOf = (items: CartItem[]) => calculateOrder(items.map((i) => ({ unitPrice: i.price, quantity: i.quantity })));

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.productId === "string" && typeof v.name === "string" && typeof v.price === "number" && typeof v.quantity === "number";
}

function readStorage(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const itemsRef = useRef<CartItem[]>([]); // salinan terbaru agar add() stabil dan langsung tahu total baru

  const commit = useCallback((next: CartItem[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  useEffect(() => {
    commit(readStorage());
    setReady(true);
    const sync = (e: StorageEvent) => e.key === STORAGE_KEY && commit(readStorage()); // sinkron antar tab
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [commit]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      const current = itemsRef.current;
      const exists = current.some((i) => i.productId === item.productId);
      const next = exists
        ? current.map((i) => (i.productId === item.productId ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) } : i))
        : [...current, { ...item, quantity }];
      commit(next);
      return totalsOf(next);
    },
    [commit]
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const current = itemsRef.current;
      commit(
        quantity < 1
          ? current.filter((i) => i.productId !== productId)
          : current.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i))
      );
    },
    [commit]
  );

  const remove = useCallback((productId: string) => commit(itemsRef.current.filter((i) => i.productId !== productId)), [commit]);
  const replaceAll = useCallback((next: CartItem[]) => commit(next), [commit]);
  const clear = useCallback(() => commit([]), [commit]);

  const value = useMemo<CartContextValue>(() => {
    const totals = totalsOf(items);
    return {
      items,
      ready,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: totals.subtotal,
      totals,
      isOpen,
      setOpen,
      add,
      setQuantity,
      remove,
      replaceAll,
      clear,
    };
  }, [items, ready, isOpen, add, setQuantity, remove, replaceAll, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>.");
  return ctx;
}