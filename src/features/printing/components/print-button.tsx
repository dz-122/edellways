"use client";
import { Loader2, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { TransactionView } from "@/features/transactions/types";
import { usePrinter } from "./printer-provider";

type PrintButtonProps = { tx: TransactionView; variant?: "icon" | "full" };

export function PrintButton({ tx, variant = "icon" }: PrintButtonProps) {
  const { supported, printing, print } = usePrinter();

  const handleClick = async () => {
    if (!supported) {
      toast.info("Browser ini tidak mendukung Bluetooth. Membuka cetak lewat browser.");
      window.open(`/admin/struk/${tx.id}`, "_blank");
      return;
    }
    await print(tx);
  };

  const icon = printing ? <Loader2 className="animate-spin" /> : <Printer />;
  return variant === "icon" ? (
    <Button variant="ghost" size="icon" aria-label="Cetak struk" disabled={printing} onClick={handleClick}>
      {icon}
    </Button>
  ) : (
    <Button disabled={printing} onClick={handleClick}>
      {icon} Cetak struk
    </Button>
  );
}
