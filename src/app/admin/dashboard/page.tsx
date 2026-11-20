import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, Flower2, PackageX, ReceiptText, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/features/auth/session";
import { SalesChart } from "@/features/dashboard/components/sales-chart";
import { getDashboardData } from "@/features/dashboard/queries";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Ringkasan" };

type Stat = { label: string; value: string | number; hint: string; icon: LucideIcon };

export default async function DashboardPage() {
  const [session, data] = await Promise.all([requireSession(), getDashboardData()]);

  const stats: Stat[] = [
    { label: "Total penjualan", value: formatRupiah(data.totalSales), hint: `Hari ini ${formatRupiah(data.todaySales)}`, icon: Banknote },
    { label: "Jumlah transaksi", value: data.transactionCount, hint: "Tidak termasuk arsip", icon: ReceiptText },
    { label: "Produk aktif", value: data.activeProducts, hint: "Tampil di toko", icon: Flower2 },
    { label: "Produk sold out", value: data.soldOutProducts, hint: "Perlu diisi ulang", icon: PackageX },
  ];

  return (
    <>
   <PageHeader title={`Halo, ${session.name.split(" ")[0]}`} description="Ringkasan aktivitas toko Edellways.">
  <Button asChild className="w-full sm:w-auto">
    <Link href="/admin/dashboard/transaksi">Catat transaksi</Link>
  </Button>
</PageHeader>

{/* HP: baris 1 = total penjualan, baris 2 = 3 kartu sisanya. Tablet: 2 kolom. Desktop: 4 kolom. */}
<div className="grid grid-cols-3 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
  {stats.map(({ label, value, hint, icon: Icon }, i) => {
    const hero = i === 0;
    return (
      <Card
        key={label}
        className={cn(
          "gap-2 py-4 sm:py-5",
          hero && "col-span-3 border-black bg-forest text-white sm:col-span-1"
        )}
      >
        <CardHeader className="flex items-center justify-between gap-2 px-3 sm:px-6">
          <CardDescription className={cn("text-[11px] leading-tight sm:text-sm", hero && "text-sm text-white/60")}>
            {label}
          </CardDescription>
          <span
            className={cn(
              "size-8 shrink-0 place-items-center rounded-full",
              hero ? "grid bg-gold/15 text-gold" : "hidden bg-accent text-accent-foreground sm:grid"
            )}
          >
            <Icon className="size-4" />
          </span>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <p className={cn("text-xl font-semibold tracking-tight sm:text-2xl", hero && "text-3xl text-gold-soft sm:text-2xl")}>
            {value}
          </p>
          <p className={cn("mt-1 text-xs", hero ? "text-white/55" : "hidden text-muted-foreground sm:block")}>{hint}</p>
        </CardContent>
      </Card>
    );
  })}
</div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Penjualan 14 hari terakhir</CardTitle>
            <CardDescription>Total termasuk PPN</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart data={data.chart} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transaksi terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recent.length === 0 && <p className="text-sm text-muted-foreground">Belum ada transaksi. Mulai dari menu Kasir.</p>}
            {data.recent.map((tx) => (
              <div key={tx.id} className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {tx.items[0]?.productName}
                    {tx.items.length > 1 && ` +${tx.items.length - 1}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(tx.createdAt)} · {tx.cashierName}</p>
                </div>
                <p className="shrink-0 font-medium">{formatRupiah(tx.total)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
