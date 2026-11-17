import { getSession } from "@/features/auth/session";
import { buildSalesWorkbook } from "@/features/transactions/export/build-workbook";
import { parseHistoryFilters } from "@/features/transactions/filters";
import { getTransactionsForExport } from "@/features/transactions/queries";
import { toDateKey } from "@/lib/format";

export const runtime = "nodejs";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return new Response("Tidak diizinkan.", { status: 401 });

  const filters = parseHistoryFilters(new URL(req.url).searchParams);
  const transactions = await getTransactionsForExport(filters);
  const buffer = await buildSalesWorkbook({ transactions, filters, generatedBy: session.name });

  const stamp = toDateKey(new Date()).replaceAll("-", "");
  return new Response(new Uint8Array(buffer as ArrayBuffer), {
    headers: {
      "Content-Type": XLSX_MIME,
      "Content-Disposition": `attachment; filename="laporan-penjualan-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
