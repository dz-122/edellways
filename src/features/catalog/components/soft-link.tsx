"use client";
import Link from "next/link";

type Props = Omit<React.ComponentProps<typeof Link>, "onClick" | "scroll"> & { onSelect: () => void };

/** Link asli (bisa dibuka di tab baru & dirayapi), tapi klik biasa berpindah tanpa reload. */
export function SoftLink({ onSelect, ...props }: Props) {
  return (
    <Link
      {...props}
      scroll={false}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onSelect();
      }}
    />
  );
}