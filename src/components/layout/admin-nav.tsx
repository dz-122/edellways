"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  LayoutDashboard,
  ReceiptText,
  Flower2,
  Tags,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Ringkasan",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/admin/dashboard/transaksi", label: "Kasir", icon: ReceiptText },
  { href: "/admin/dashboard/riwayat", label: "Riwayat", icon: History },
  { href: "/admin/dashboard/produk", label: "Produk", icon: Flower2 },
  { href: "/admin/dashboard/kategori", label: "Kategori", icon: Tags },
];

export function AdminNav({ horizontal = false }: { horizontal?: boolean }) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        horizontal
          ? "flex gap-1 overflow-x-auto px-3 pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden"
          : "flex flex-col gap-1",
      )}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-gold-soft"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white",
            )}
          >
           <Icon className={cn("size-4", active && "text-gold")} /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
