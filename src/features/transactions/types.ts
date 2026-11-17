import type { PaymentMethod } from "./constants";

export type TransactionItemView = {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  note: string | null;
  subtotal: number;
};

/** Bentuk transaksi yang aman dikirim ke Client Component (tanggal berupa string ISO). */
export type TransactionView = {
  id: string;
  transactionNumber: string;
  cashierName: string;
  customerName: string | null;
  paymentMethod: PaymentMethod;
  subtotal: number;
  ppnRate: number;
  ppnAmount: number;
  total: number;
  amountReceived: number;
  changeAmount: number;
  createdAt: string;
  deletedAt: string | null;
  items: TransactionItemView[];
};

export type ProductOption = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  soldOut: boolean;
};

export type HistoryStatus = "active" | "archived" | "all";

export type HistoryFilters = {
  q: string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  cashier: string;
  method: PaymentMethod | "";
  status: HistoryStatus;
};

export type HistoryPage = {
  rows: TransactionView[];
  page: number;
  pageCount: number;
  totalCount: number;
  totalSales: number;
};
