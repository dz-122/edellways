import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { HistoryFilterBar } from "@/features/transactions/components/history-filter-bar";
import { HistoryPagination } from "@/features/transactions/components/history-pagination";
import { HistoryTable } from "@/features/transactions/components/history-table";
import { parseHistoryFilters, parsePage } from "@/features/transactions/filters";
import { getCashierNames, getTransactionPage } from "@/features/transactions/queries";

export const metadata: Metadata = { title: "Riwayat transaksi" };

type SearchParams = Record<string, string | string[] | undefined>;

export default async function HistoryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const filters = parseHistoryFilters(sp);
  const [result, cashiers] = await Promise.all([getTransactionPage(filters, parsePage(sp)), getCashierNames()]);

  return (
    <>
      <PageHeader title="Riwayat transaksi" description="Filter tersimpan di URL, jadi bisa di-bookmark dan dibagikan." />
      <Suspense>
        <HistoryFilterBar filters={filters} cashiers={cashiers} totalCount={result.totalCount} totalSales={result.totalSales} />
      </Suspense>
      <HistoryTable rows={result.rows} />
      <Suspense>
        <HistoryPagination page={result.page} pageCount={result.pageCount} />
      </Suspense>
    </>
  );
}