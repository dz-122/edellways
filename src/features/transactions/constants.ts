export const PPN_RATE = 11;

export const PAYMENT_METHODS = ["CASH", "NON_CASH"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH: "Tunai",
  NON_CASH: "Non tunai",
};

export const HISTORY_PAGE_SIZE = 25;
export const EXPORT_MAX_ROWS = 10_000;
