"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Archive, Eye, Loader2, Undo2 } from "lucide-react";
import { PrintButton } from "@/features/printing/components/print-button";
import { usePrinter } from "@/features/printing/components/printer-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { archiveTransaction, restoreTransaction } from "../actions";
import { PAYMENT_LABELS } from "../constants";
import type { TransactionView } from "../types";
import { Receipt } from "./receipt";

export function HistoryTable({ rows }: { rows: TransactionView[] }) {
  const { cols } = usePrinter();
  const [viewing, setViewing] = useState<TransactionView | null>(null);
  const [archiving, setArchiving] = useState<TransactionView | null>(null);
  const [pending, startTransition] = useTransition();

  const handleArchive = () => {
    if (!archiving) return;
    startTransition(async () => {
      const result = await archiveTransaction(archiving.id);
      if (!result.ok) { toast.error(result.error); return; }
      toast.success("Transaksi diarsipkan.");
      setArchiving(null);
    });
  };

  const handleRestore = (tx: TransactionView) =>
    startTransition(async () => {
      const result = await restoreTransaction(tx.id);
      if (!result.ok) { toast.error(result.error); return; }
      toast.success("Transaksi dipulihkan.");
    });

  return (
    <>
      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Waktu</TableHead>
              <TableHead>Kasir</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="pr-4 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  Tidak ada transaksi yang cocok. Coba ubah atau reset filter.
                </TableCell>
              </TableRow>
            )}
            {rows.map((tx) => (
              <TableRow key={tx.id} className={cn(tx.deletedAt && "bg-muted/40 text-muted-foreground")}>
                <TableCell className="whitespace-nowrap pl-4">
                  <p>{formatDateTime(tx.createdAt)}</p>
                  <p className="text-xs text-muted-foreground">{tx.transactionNumber}</p>
                </TableCell>
                <TableCell>{tx.cashierName}</TableCell>
                <TableCell className="text-muted-foreground">{tx.customerName ?? "-"}</TableCell>
                <TableCell>
                  <p className="max-w-56 truncate">{tx.items[0]?.productName}</p>
                  {tx.items.length > 1 && <p className="text-xs text-muted-foreground">+{tx.items.length - 1} produk lainnya</p>}
                </TableCell>
                <TableCell className="text-right">{tx.items.reduce((sum, i) => sum + i.quantity, 0)}</TableCell>
                <TableCell className="whitespace-nowrap text-right font-medium">
                  {formatRupiah(tx.total)}
                  <p className="text-xs font-normal text-muted-foreground">
                    {PAYMENT_LABELS[tx.paymentMethod]}
                    {tx.deletedAt && <Badge variant="outline" className="ml-1.5">Arsip</Badge>}
                  </p>
                </TableCell>
                <TableCell className="whitespace-nowrap pr-4 text-right">
                  <Button variant="ghost" size="icon" aria-label="Lihat" onClick={() => setViewing(tx)}><Eye /></Button>
                  <PrintButton tx={tx} />
                  {tx.deletedAt ? (
                    <Button variant="ghost" size="icon" aria-label="Pulihkan" disabled={pending} onClick={() => handleRestore(tx)}><Undo2 /></Button>
                  ) : (
                    <Button variant="ghost" size="icon" aria-label="Arsipkan" onClick={() => setArchiving(tx)}><Archive className="text-destructive" /></Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail transaksi</DialogTitle>
            <DialogDescription>{viewing?.transactionNumber}</DialogDescription>
          </DialogHeader>
          {viewing && <div className="overflow-hidden rounded-lg border"><Receipt tx={viewing} cols={cols} /></div>}
          <DialogFooter>{viewing && <PrintButton tx={viewing} variant="full" />}</DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={archiving !== null} onOpenChange={(open) => !open && setArchiving(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Arsipkan transaksi ini?</DialogTitle>
            <DialogDescription>
              {archiving?.transactionNumber} sebesar {archiving && formatRupiah(archiving.total)} tidak akan dihitung di laporan penjualan.
              Data tidak dihapus permanen dan bisa dipulihkan lewat filter Arsip.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiving(null)}>Batal</Button>
            <Button variant="destructive" disabled={pending} onClick={handleArchive}>
              {pending && <Loader2 className="animate-spin" />} Arsipkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
