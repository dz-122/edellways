import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireSession } from "@/features/auth/session";
import { PrintTrigger } from "@/features/transactions/components/print-trigger";
import { Receipt } from "@/features/transactions/components/receipt";
import { getTransactionById } from "@/features/transactions/queries";

export const metadata: Metadata = { title: "Struk" };

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession();
  const { id } = await params;
  const tx = await getTransactionById(id);
  if (!tx) notFound();

  return (
    <div className="min-h-screen bg-muted py-6 print:bg-white print:py-0">
      <PrintTrigger />
      <Receipt tx={tx} />
    </div>
  );
}
