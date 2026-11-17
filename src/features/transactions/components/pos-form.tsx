"use client";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Minus, Plus, Search, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/shared/product-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { createTransaction } from "../actions";
import { calculateOrder } from "../calculations";
import { PAYMENT_LABELS, PAYMENT_METHODS, PPN_RATE, type PaymentMethod } from "../constants";
import type { ProductOption, TransactionView } from "../types";
import { PrintButton } from "@/features/printing/components/print-button";
import { usePrinter } from "@/features/printing/components/printer-provider";
import { Receipt } from "./receipt";

type CartLine = { productId: string; name: string; price: number; quantity: number; note: string };

type PosFormProps = { products: ProductOption[]; defaultCashier: string };

const QUICK_AMOUNTS = [
  { label: "50rb", value: 50_000 },
  { label: "100rb", value: 100_000 },
  { label: "200rb", value: 200_000 },
];

export function PosForm({ products, defaultCashier }: PosFormProps) {
  const [query, setQuery] = useState("");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cashier, setCashier] = useState(defaultCashier);
  const [customer, setCustomer] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [received, setReceived] = useState("");
  const [completed, setCompleted] = useState<TransactionView | null>(null);
  const [pending, startTransition] = useTransition();
  const { cols } = usePrinter();

  // Hanya untuk tampilan. Angka final dihitung ulang di server.
  const totals = useMemo(() => calculateOrder(lines.map((l) => ({ unitPrice: l.price, quantity: l.quantity }))), [lines]);
  const change = (Number(received) || 0) - totals.total;
  const visibleProducts = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const addProduct = (product: ProductOption) =>
    setLines((current) =>
      current.some((l) => l.productId === product.id)
        ? current.map((l) => (l.productId === product.id ? { ...l, quantity: l.quantity + 1 } : l))
        : [...current, { productId: product.id, name: product.name, price: product.price, quantity: 1, note: "" }]
    );
  const updateLine = (productId: string, patch: Partial<CartLine>) =>
    setLines((current) => current.map((l) => (l.productId === productId ? { ...l, ...patch } : l)));
  const removeLine = (productId: string) => setLines((current) => current.filter((l) => l.productId !== productId));

  const canSubmit = lines.length > 0 && cashier.trim() !== "" && (method === "NON_CASH" || (received !== "" && change >= 0));

  const handleSubmit = () =>
    startTransition(async () => {
      const result = await createTransaction({
        cashierName: cashier,
        customerName: customer,
        paymentMethod: method,
        amountReceived: Number(received) || 0,
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity, note: l.note })),
      });
      if (!result.ok) { toast.error(result.error); return; }
      toast.success("Transaksi disimpan.");
      setCompleted(result.data);
      setLines([]);
      setCustomer("");
      setReceived("");
    });

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
      <div>
        <div className="relative mb-3 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Cari produk" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              disabled={product.soldOut}
              onClick={() => addProduct(product)}
              className={cn(
                "overflow-hidden rounded-xl border bg-card text-left transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                product.soldOut ? "opacity-50" : "hover:border-primary hover:shadow-sm"
              )}
            >
              <ProductImage src={product.image} alt={product.name} sizes="240px" className="aspect-square w-full" />
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{formatRupiah(product.price)}</p>
                {product.soldOut && (
                  <Badge variant="destructive" className="mt-2">
                    Sold out
                  </Badge>
                )}
              </div>
            </button>
          ))}
          {visibleProducts.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">Produk tidak ditemukan.</p>
          )}
        </div>
      </div>

      <Card className="h-fit lg:sticky lg:top-6">
        <CardHeader>
          <CardTitle>Rincian transaksi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cashier">Kasir</Label>
              <Input id="cashier" value={cashier} onChange={(e) => setCashier(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="customer">Pelanggan (opsional)</Label>
              <Input id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            {lines.length === 0 && (
              <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">Pilih produk dari daftar di kiri.</p>
            )}
            {lines.map((line) => (
              <div key={line.productId} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{line.name}</p>
                    <p className="text-xs text-muted-foreground">{formatRupiah(line.price)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="size-7" aria-label="Hapus item" onClick={() => removeLine(line.productId)}>
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="size-8" aria-label="Kurangi" onClick={() => updateLine(line.productId, { quantity: Math.max(1, line.quantity - 1) })}>
                    <Minus />
                  </Button>
                  <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                  <Button variant="outline" size="icon" className="size-8" aria-label="Tambah" onClick={() => updateLine(line.productId, { quantity: line.quantity + 1 })}>
                    <Plus />
                  </Button>
                  <p className="ml-auto text-sm font-medium">{formatRupiah(line.price * line.quantity)}</p>
                </div>
                <Input className="h-8 text-xs" placeholder="Catatan produk (opsional)" value={line.note} onChange={(e) => updateLine(line.productId, { note: e.target.value })} />
              </div>
            ))}
          </div>

          <div className="space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatRupiah(totals.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">PPN ({PPN_RATE}%)</span><span>{formatRupiah(totals.ppnAmount)}</span></div>
            <div className="flex justify-between pt-1 text-base font-semibold"><span>Total bayar</span><span>{formatRupiah(totals.total)}</span></div>
          </div>

          <div className="space-y-3 border-t pt-3">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="group" aria-label="Metode pembayaran">
              {PAYMENT_METHODS.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={method === value}
                  onClick={() => setMethod(value)}
                  className={cn("rounded-md py-1.5 text-sm font-medium transition", method === value ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}
                >
                  {PAYMENT_LABELS[value]}
                </button>
              ))}
            </div>

            {method === "CASH" && (
              <div className="space-y-2">
                <Label htmlFor="received">Uang diterima</Label>
                <Input id="received" type="number" min={0} value={received} onChange={(e) => setReceived(e.target.value)} />
                <div className="flex flex-wrap gap-1.5">
                  <Button type="button" variant="outline" size="sm" disabled={!totals.total} onClick={() => setReceived(String(totals.total))}>
                    Uang pas
                  </Button>
                  {QUICK_AMOUNTS.map(({ label, value }) => (
                    <Button key={label} type="button" variant="outline" size="sm" onClick={() => setReceived(String(value))}>
                      {label}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kembalian</span>
                  <span className={cn("font-medium", received !== "" && change < 0 && "text-destructive")}>
                    {received === "" ? "-" : change < 0 ? `Kurang ${formatRupiah(-change)}` : formatRupiah(change)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Button className="w-full" size="lg" disabled={!canSubmit || pending} onClick={handleSubmit}>
            {pending && <Loader2 className="animate-spin" />} Simpan transaksi
          </Button>
        </CardContent>
      </Card>

      <Dialog open={completed !== null} onOpenChange={(open) => !open && setCompleted(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Transaksi tersimpan</DialogTitle>
            <DialogDescription>{completed?.transactionNumber}</DialogDescription>
          </DialogHeader>
          {completed && (
            <div className="overflow-hidden rounded-lg border">
              <Receipt tx={completed} cols={cols} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleted(null)}>Transaksi baru</Button>
            {completed && <PrintButton tx={completed} variant="full" />}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
