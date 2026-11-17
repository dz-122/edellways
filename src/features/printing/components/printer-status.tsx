"use client";
import { Bluetooth, BluetoothConnected, Loader2 } from "lucide-react";
import { NativeSelect } from "@/components/shared/native-select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PAPER_OPTIONS } from "../constants";
import { usePrinter } from "./printer-provider";

export function PrinterStatus({ compact = false }: { compact?: boolean }) {
  const { supported, status, deviceName, cols, setCols, connect, disconnect } = usePrinter();
  const connected = status === "connected";
  const connecting = status === "connecting";
  const Icon = connected ? BluetoothConnected : Bluetooth;

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled={!supported || connecting}
        onClick={connected ? disconnect : connect}
        className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
        aria-label={connected ? `Printer ${deviceName} terhubung` : "Hubungkan printer"}
      >
        {connecting ? <Loader2 className="animate-spin" /> : <Icon className={cn(connected && "text-emerald-300")} />}
        {connected ? deviceName : "Printer"}
      </Button>
    );
  }

  return (
    <div className="mb-4 space-y-2 rounded-lg border border-sidebar-border p-3 text-sm">
      <div className="flex items-center gap-2">
        <span className={cn("size-2 rounded-full", connected ? "bg-emerald-400" : "bg-white/30")} />
        <p className="truncate font-medium">{connected ? deviceName : "Printer belum terhubung"}</p>
      </div>
      {!supported ? (
        <p className="text-xs text-sidebar-foreground/60">Bluetooth tidak tersedia. Pakai Chrome/Edge lewat HTTPS.</p>
      ) : (
        <>
          <NativeSelect
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            aria-label="Lebar kertas"
            className="h-8 border-sidebar-border bg-sidebar-accent text-xs text-white"
          >
            {PAPER_OPTIONS.map((o) => (
              <option key={o.cols} value={o.cols} className="text-black">
                Kertas {o.label}
              </option>
            ))}
          </NativeSelect>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-sidebar-border bg-transparent text-white hover:bg-sidebar-accent hover:text-white"
            disabled={connecting}
            onClick={connected ? disconnect : connect}
          >
            {connecting && <Loader2 className="animate-spin" />}
            {connected ? "Putuskan" : connecting ? "Menghubungkan..." : "Hubungkan printer"}
          </Button>
        </>
      )}
    </div>
  );
}
