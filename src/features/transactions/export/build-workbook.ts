import "server-only";
import ExcelJS from "exceljs";
import { STORE } from "@/config/store";
import { toDateKey } from "@/lib/format";
import { PAYMENT_LABELS } from "../constants";
import type { HistoryFilters, TransactionView } from "../types";

const COLOR = {
  green: "FF1F4D3A",
  greenSoft: "FFDFE9E2",
  cream: "FFF6F7F6",
  zebra: "FFF8FAF9",
  border: "FFE3E7E5",
  text: "FF18211D",
  muted: "FF66716B",
  white: "FFFFFFFF",
};
const FONT = "Calibri";
const RUPIAH = '"Rp"#,##0';
const DATETIME = "dd mmm yyyy hh:mm";
const thin: Partial<ExcelJS.Border> = { style: "thin", color: { argb: COLOR.border } };
const BORDER: Partial<ExcelJS.Borders> = { top: thin, left: thin, bottom: thin, right: thin };

type Cell = string | number | Date | null;
type ColumnSpec = { header: string; width: number; format?: string; align?: "left" | "center" | "right" };

// Excel menyimpan tanggal tanpa zona waktu: geser agar yang tampil adalah jam lokal toko.
function offsetMs(): number {
  const m = /^([+-])(\d{2}):(\d{2})$/.exec(STORE.utcOffset);
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) * 60_000;
}
const toSheetDate = (iso: string) => new Date(new Date(iso).getTime() + offsetMs());

const longDate = (d: Date | string) =>
  new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: STORE.timezone }).format(new Date(d));

function addTitle(ws: ExcelJS.Worksheet, title: string, subtitle: string, lastCol: number) {
  ws.mergeCells(1, 1, 1, lastCol);
  const t = ws.getCell(1, 1);
  t.value = title;
  t.font = { name: "Cambria", size: 18, bold: true, color: { argb: COLOR.green } };
  t.alignment = { vertical: "middle" };
  ws.getRow(1).height = 30;

  ws.mergeCells(2, 1, 2, lastCol);
  const s = ws.getCell(2, 1);
  s.value = subtitle;
  s.font = { name: FONT, size: 10, color: { argb: COLOR.muted } };
}

function styleHeaderRow(row: ExcelJS.Row, count: number, columns: ColumnSpec[]) {
  row.height = 24;
  for (let c = 1; c <= count; c++) {
    const cell = row.getCell(c);
    cell.font = { name: FONT, size: 10, bold: true, color: { argb: COLOR.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.green } };
    cell.alignment = { vertical: "middle", horizontal: columns[c - 1].align ?? "left", wrapText: true };
    cell.border = BORDER;
  }
}

function addDataRow(ws: ExcelJS.Worksheet, rowNumber: number, values: Cell[], columns: ColumnSpec[], zebra: boolean) {
  const row = ws.getRow(rowNumber);
  values.forEach((value, i) => {
    const cell = row.getCell(i + 1);
    cell.value = value;
    cell.font = { name: FONT, size: 10, color: { argb: COLOR.text } };
    cell.border = BORDER;
    cell.alignment = { vertical: "middle", horizontal: columns[i].align ?? "left" };
    if (columns[i].format) cell.numFmt = columns[i].format!;
    if (zebra) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.zebra } };
  });
}

/** Baris total memakai SUBTOTAL(109) sehingga ikut berubah saat filter Excel dipakai. */
function addTotalRow(ws: ExcelJS.Worksheet, rowNumber: number, first: number, last: number, columns: ColumnSpec[], sums: Record<number, number>, label: string) {
  const row = ws.getRow(rowNumber);
  row.height = 22;
  for (let c = 1; c <= columns.length; c++) {
    const cell = row.getCell(c);
    cell.font = { name: FONT, size: 10, bold: true, color: { argb: COLOR.green } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.greenSoft } };
    cell.border = { top: { style: "medium", color: { argb: COLOR.green } }, bottom: thin, left: thin, right: thin };
    cell.alignment = { vertical: "middle", horizontal: columns[c - 1].align ?? "left" };
    if (columns[c - 1].format) cell.numFmt = columns[c - 1].format!;
  }
  row.getCell(1).value = label;
  for (const [col, result] of Object.entries(sums)) {
    const letter = ws.getColumn(Number(col)).letter;
    row.getCell(Number(col)).value = { formula: `SUBTOTAL(109,${letter}${first}:${letter}${last})`, result };
  }
}

function setupSheet(ws: ExcelJS.Worksheet, columns: ColumnSpec[], headerRow: number) {
  columns.forEach((c, i) => (ws.getColumn(i + 1).width = c.width));
  ws.views = [{ state: "frozen", ySplit: headerRow, showGridLines: false }];
  ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: { left: 0.4, right: 0.4, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 } };
  ws.headerFooter.oddFooter = `&L${STORE.name}&CHalaman &P dari &N&R&D`;
  ws.pageSetup.printTitlesRow = `${headerRow}:${headerRow}`;
}

function describePeriod(filters: HistoryFilters, transactions: TransactionView[]): string {
  if (filters.from || filters.to) {
    const f = filters.from ? longDate(`${filters.from}T00:00:00${STORE.utcOffset}`) : "awal";
    const t = filters.to ? longDate(`${filters.to}T00:00:00${STORE.utcOffset}`) : "sekarang";
    return `${f} s/d ${t}`;
  }
  if (!transactions.length) return "Semua periode";
  return `${longDate(transactions[0].createdAt)} s/d ${longDate(transactions[transactions.length - 1].createdAt)}`;
}

function describeFilters(filters: HistoryFilters): string {
  const parts = [
    filters.cashier && `Kasir: ${filters.cashier}`,
    filters.method && `Metode: ${PAYMENT_LABELS[filters.method]}`,
    filters.q && `Pencarian: "${filters.q}"`,
    `Status: ${{ active: "Aktif", archived: "Arsip", all: "Aktif + arsip" }[filters.status]}`,
  ].filter(Boolean);
  return parts.join("  |  ");
}

type BuildInput = { transactions: TransactionView[]; filters: HistoryFilters; generatedBy: string };

export async function buildSalesWorkbook({ transactions, filters, generatedBy }: BuildInput) {
  const wb = new ExcelJS.Workbook();
  wb.creator = `${STORE.name} Admin`;
  wb.created = new Date();

  const period = describePeriod(filters, transactions);
  const generated = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short", timeZone: STORE.timezone }).format(new Date());
  const subtitle = `Periode: ${period}   |   Dibuat: ${generated} oleh ${generatedBy}`;

  // Laporan penjualan tidak menghitung transaksi arsip.
  const sales = transactions.filter((t) => !t.deletedAt);

  buildSummarySheet(wb, sales, filters, period, subtitle);
  buildTransactionsSheet(wb, transactions, subtitle);
  buildItemsSheet(wb, transactions, subtitle);

  return wb.xlsx.writeBuffer();
}

/* ---------------- Ringkasan ---------------- */

function buildSummarySheet(wb: ExcelJS.Workbook, sales: TransactionView[], filters: HistoryFilters, period: string, subtitle: string) {
  const ws = wb.addWorksheet("Ringkasan", { properties: { tabColor: { argb: COLOR.green } } });
  const widths = [30, 18, 24, 20, 20];
  widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));
  ws.views = [{ showGridLines: false }];
  ws.pageSetup = { orientation: "portrait", paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0 };

  addTitle(ws, `Laporan Penjualan ${STORE.name}`, subtitle, 5);
  ws.mergeCells(3, 1, 3, 5);
  ws.getCell(3, 1).value = describeFilters(filters);
  ws.getCell(3, 1).font = { name: FONT, size: 10, italic: true, color: { argb: COLOR.muted } };

  const totalSales = sales.reduce((s, t) => s + t.total, 0);
  const totalPpn = sales.reduce((s, t) => s + t.ppnAmount, 0);
  const unitsSold = sales.reduce((s, t) => s + t.items.reduce((n, i) => n + i.quantity, 0), 0);
  const kpis: [string, number, string][] = [
    ["Total penjualan", totalSales, RUPIAH],
    ["Jumlah transaksi", sales.length, "#,##0"],
    ["Rata-rata per transaksi", sales.length ? Math.round(totalSales / sales.length) : 0, RUPIAH],
    ["Total PPN", totalPpn, RUPIAH],
    ["Unit terjual", unitsSold, "#,##0"],
  ];
  kpis.forEach(([label, value, format], i) => {
    const l = ws.getCell(5, i + 1);
    l.value = label;
    l.font = { name: FONT, size: 9, color: { argb: COLOR.muted } };
    l.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.greenSoft } };
    l.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    const v = ws.getCell(6, i + 1);
    v.value = value;
    v.numFmt = format;
    v.font = { name: "Cambria", size: 15, bold: true, color: { argb: COLOR.green } };
    v.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.greenSoft } };
    v.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  });
  ws.getRow(5).height = 18;
  ws.getRow(6).height = 28;

  const byDay = new Map<string, { label: string; count: number; total: number }>();
  const byMethod = new Map<string, { count: number; total: number }>();
  const byProduct = new Map<string, { qty: number; revenue: number }>();
  for (const t of sales) {
    const key = toDateKey(t.createdAt);
    const day = byDay.get(key) ?? { label: longDate(t.createdAt), count: 0, total: 0 };
    day.count += 1;
    day.total += t.total;
    byDay.set(key, day);

    const m = byMethod.get(PAYMENT_LABELS[t.paymentMethod]) ?? { count: 0, total: 0 };
    m.count += 1;
    m.total += t.total;
    byMethod.set(PAYMENT_LABELS[t.paymentMethod], m);

    for (const item of t.items) {
      const p = byProduct.get(item.productName) ?? { qty: 0, revenue: 0 };
      p.qty += item.quantity;
      p.revenue += item.subtotal;
      byProduct.set(item.productName, p);
    }
  }

  let row = 8;
  row = addSummaryTable(ws, row, "Penjualan per hari",
    [{ header: "Tanggal", width: 0 }, { header: "Transaksi", width: 0, format: "#,##0", align: "right" }, { header: "Penjualan", width: 0, format: RUPIAH, align: "right" }],
    [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, d]) => [d.label, d.count, d.total]), true);
  row = addSummaryTable(ws, row + 1, "Per metode pembayaran",
    [{ header: "Metode", width: 0 }, { header: "Transaksi", width: 0, format: "#,##0", align: "right" }, { header: "Penjualan", width: 0, format: RUPIAH, align: "right" }],
    [...byMethod.entries()].map(([name, d]) => [name, d.count, d.total]), true);
  addSummaryTable(ws, row + 1, "Produk terlaris (10 teratas)",
    [{ header: "Produk", width: 0 }, { header: "Qty", width: 0, format: "#,##0", align: "right" }, { header: "Pendapatan (sebelum PPN)", width: 0, format: RUPIAH, align: "right" }],
    [...byProduct.entries()].sort(([, a], [, b]) => b.revenue - a.revenue).slice(0, 10).map(([name, p]) => [name, p.qty, p.revenue]), false);

  if (!sales.length) {
    ws.mergeCells(8, 1, 8, 5);
    ws.getCell(8, 1).value = `Tidak ada transaksi pada periode ${period}.`;
    ws.getCell(8, 1).font = { name: FONT, size: 11, italic: true, color: { argb: COLOR.muted } };
  }
}

function addSummaryTable(ws: ExcelJS.Worksheet, startRow: number, title: string, columns: ColumnSpec[], rows: Cell[][], withTotal: boolean): number {
  if (!rows.length) return startRow;
  ws.mergeCells(startRow, 1, startRow, 3);
  const t = ws.getCell(startRow, 1);
  t.value = title;
  t.font = { name: "Cambria", size: 12, bold: true, color: { argb: COLOR.green } };
  ws.getRow(startRow).height = 22;

  const headerRow = startRow + 1;
  columns.forEach((c, i) => (ws.getCell(headerRow, i + 1).value = c.header));
  styleHeaderRow(ws.getRow(headerRow), columns.length, columns);

  rows.forEach((values, i) => addDataRow(ws, headerRow + 1 + i, values, columns, i % 2 === 1));
  let last = headerRow + rows.length;

  if (withTotal) {
    const first = headerRow + 1;
    const totals: Record<number, number> = {
      2: rows.reduce((s, r) => s + Number(r[1]), 0),
      3: rows.reduce((s, r) => s + Number(r[2]), 0),
    };
    addTotalRow(ws, last + 1, first, last, columns, totals, "Total");
    last += 1;
  }
  return last + 1;
}

/* ---------------- Transaksi ---------------- */

function buildTransactionsSheet(wb: ExcelJS.Workbook, transactions: TransactionView[], subtitle: string) {
  const ws = wb.addWorksheet("Transaksi");
  const columns: ColumnSpec[] = [
    { header: "No", width: 6, align: "center" },
    { header: "Tanggal & Waktu", width: 19, format: DATETIME },
    { header: "No. Transaksi", width: 22 },
    { header: "Kasir", width: 18 },
    { header: "Pelanggan", width: 20 },
    { header: "Metode", width: 12, align: "center" },
    { header: "Jumlah Item", width: 12, format: "#,##0", align: "right" },
    { header: "Subtotal", width: 15, format: RUPIAH, align: "right" },
    { header: "PPN", width: 14, format: RUPIAH, align: "right" },
    { header: "Total Bayar", width: 16, format: RUPIAH, align: "right" },
    { header: "Diterima", width: 16, format: RUPIAH, align: "right" },
    { header: "Kembalian", width: 15, format: RUPIAH, align: "right" },
    { header: "Status", width: 11, align: "center" },
  ];
  const HEADER = 4;
  setupSheet(ws, columns, HEADER);
  addTitle(ws, "Daftar Transaksi", subtitle, columns.length);
  columns.forEach((c, i) => (ws.getCell(HEADER, i + 1).value = c.header));
  styleHeaderRow(ws.getRow(HEADER), columns.length, columns);

  transactions.forEach((t, i) => {
    addDataRow(ws, HEADER + 1 + i, [
      i + 1, toSheetDate(t.createdAt), t.transactionNumber, t.cashierName, t.customerName ?? "-",
      PAYMENT_LABELS[t.paymentMethod], t.items.reduce((n, it) => n + it.quantity, 0),
      t.subtotal, t.ppnAmount, t.total, t.amountReceived, t.changeAmount, t.deletedAt ? "Arsip" : "Aktif",
    ], columns, i % 2 === 1);
    if (t.deletedAt) ws.getRow(HEADER + 1 + i).font = { name: FONT, size: 10, italic: true, color: { argb: COLOR.muted } };
  });

  if (!transactions.length) {
    ws.mergeCells(HEADER + 1, 1, HEADER + 1, columns.length);
    ws.getCell(HEADER + 1, 1).value = "Tidak ada transaksi yang cocok dengan filter.";
    ws.getCell(HEADER + 1, 1).font = { name: FONT, italic: true, color: { argb: COLOR.muted } };
    return;
  }

  const first = HEADER + 1;
  const last = HEADER + transactions.length;
  addTotalRow(ws, last + 1, first, last, columns, {
    7: transactions.reduce((s, t) => s + t.items.reduce((n, it) => n + it.quantity, 0), 0),
    8: transactions.reduce((s, t) => s + t.subtotal, 0),
    9: transactions.reduce((s, t) => s + t.ppnAmount, 0),
    10: transactions.reduce((s, t) => s + t.total, 0),
  }, "Total");
  ws.autoFilter = { from: { row: HEADER, column: 1 }, to: { row: last, column: columns.length } };
}

/* ---------------- Detail item ---------------- */

function buildItemsSheet(wb: ExcelJS.Workbook, transactions: TransactionView[], subtitle: string) {
  const ws = wb.addWorksheet("Detail Item");
  const columns: ColumnSpec[] = [
    { header: "No", width: 6, align: "center" },
    { header: "Tanggal & Waktu", width: 19, format: DATETIME },
    { header: "No. Transaksi", width: 22 },
    { header: "Kasir", width: 18 },
    { header: "Pelanggan", width: 20 },
    { header: "Produk", width: 28 },
    { header: "Harga Satuan", width: 16, format: RUPIAH, align: "right" },
    { header: "Qty", width: 8, format: "#,##0", align: "right" },
    { header: "Subtotal Item", width: 16, format: RUPIAH, align: "right" },
    { header: "Catatan", width: 30 },
    { header: "Status", width: 11, align: "center" },
  ];
  const HEADER = 4;
  setupSheet(ws, columns, HEADER);
  addTitle(ws, "Rincian Item per Transaksi", subtitle, columns.length);
  columns.forEach((c, i) => (ws.getCell(HEADER, i + 1).value = c.header));
  styleHeaderRow(ws.getRow(HEADER), columns.length, columns);

  const items = transactions.flatMap((t) => t.items.map((it) => ({ t, it })));
  items.forEach(({ t, it }, i) => {
    addDataRow(ws, HEADER + 1 + i, [
      i + 1, toSheetDate(t.createdAt), t.transactionNumber, t.cashierName, t.customerName ?? "-",
      it.productName, it.unitPrice, it.quantity, it.subtotal, it.note ?? "", t.deletedAt ? "Arsip" : "Aktif",
    ], columns, i % 2 === 1);
  });

  if (!items.length) return;
  const first = HEADER + 1;
  const last = HEADER + items.length;
  addTotalRow(ws, last + 1, first, last, columns, {
    8: items.reduce((s, { it }) => s + it.quantity, 0),
    9: items.reduce((s, { it }) => s + it.subtotal, 0),
  }, "Total");
  ws.autoFilter = { from: { row: HEADER, column: 1 }, to: { row: last, column: columns.length } };
}
