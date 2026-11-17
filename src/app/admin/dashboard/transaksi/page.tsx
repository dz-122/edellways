import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { requireSession } from "@/features/auth/session";
import { PosForm } from "@/features/transactions/components/pos-form";
import { getSellableProducts } from "@/features/transactions/queries";

export const metadata: Metadata = { title: "Kasir" };

export default async function CashierPage() {
  const [session, products] = await Promise.all([requireSession(), getSellableProducts()]);
  return (
    <>
      <PageHeader title="Kasir" description="Catat pesanan yang masuk dari WhatsApp atau pembeli di toko." />
      <PosForm products={products} defaultCashier={session.name} />
    </>
  );
}
