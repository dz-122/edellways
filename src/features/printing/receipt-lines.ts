import { STORE } from "@/config/store";
import {
  formatDateTime,
  formatNumber,
  formatRupiah,
} from "@/lib/format";
import type { TransactionView } from "@/features/transactions/types";

export type ReceiptLine = {
  text: string;
  align?: "left" | "center";
  bold?: boolean;
  large?: boolean;
};

/**
 * Membungkus teks sesuai lebar karakter.
 * Kata yang terlalu panjang akan dipecah, bukan dihilangkan.
 */
export function wrapText(
  text: string,
  width: number,
  indent = 0
): string[] {
  const pad = " ".repeat(indent);
  const available = Math.max(1, width - indent);
  const lines: string[] = [];

  let current = "";

  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (word.length > available) {
      if (current) {
        lines.push(pad + current);
        current = "";
      }

      for (let i = 0; i < word.length; i += available) {
        lines.push(pad + word.slice(i, i + available));
      }

      continue;
    }

    const next = current ? `${current} ${word}` : word;

    if (next.length <= available) {
      current = next;
    } else {
      if (current) lines.push(pad + current);
      current = word;
    }
  }

  if (current) lines.push(pad + current);

  return lines.length ? lines : [pad];
}

/**
 * Membuat baris dengan teks kiri dan kanan.
 */
function leftRight(
  left: string,
  right: string,
  cols: number,
  indent = 0
): string[] {
  const l = " ".repeat(indent) + left;

  if (l.length + right.length + 1 > cols) {
    return [
      ...wrapText(left, cols, indent),
      right.slice(0, cols).padStart(cols),
    ];
  }

  return [
    l +
      " ".repeat(cols - l.length - right.length) +
      right,
  ];
}

/**
 * Membuat seluruh isi struk.
 * Ukuran default dikunci ke 32 kolom / 58 mm.
 */
export function buildReceiptLines(
  tx: TransactionView,
  cols = 32
): ReceiptLine[] {
  const lines: ReceiptLine[] = [];

  const add = (
    text: string,
    extra: Omit<ReceiptLine, "text"> = {}
  ) => {
    lines.push({ text, ...extra });
  };

  const rule = (char = "-") => {
    add(char.repeat(cols));
  };

  const row = (
    left: string,
    right: string,
    opts: Omit<ReceiptLine, "text"> = {}
  ) => {
    leftRight(left, right, cols).forEach((text) => {
      add(text, opts);
    });
  };

  // HEADER TOKO
  // Font besar memiliki kapasitas setengah kolom.
  const largeCols = Math.floor(cols / 2);

  wrapText(STORE.name.toUpperCase(), largeCols).forEach(
    (text) => {
      add(text, {
        align: "center",
        bold: true,
        large: true,
      });
    }
  );

  wrapText(`"${STORE.slogan}"`, cols).forEach((text) => {
    add(text, { align: "center" });
  });

  wrapText(STORE.address, cols).forEach((text) => {
    add(text.trim(), { align: "center" });
  });

  rule();

  // INFORMASI TRANSAKSI
  row("No", tx.transactionNumber);
  row("Tanggal", formatDateTime(tx.createdAt));
  row("Kasir", tx.cashierName);

  if (tx.customerName) {
    row("Pelanggan", tx.customerName);
  }

  rule();

  // DETAIL PRODUK
  tx.items.forEach((item, index) => {
    wrapText(
      `${index + 1}. ${item.productName}`,
      cols
    ).forEach((text) => add(text));

    leftRight(
      `${item.quantity} x ${formatRupiah(item.unitPrice)}`,
      formatNumber(item.subtotal),
      cols,
      3
    ).forEach((text) => add(text));

    if (item.note) {
      wrapText(`Catatan: ${item.note}`, cols, 3).forEach(
        (text) => add(text)
      );
    }

    add("");
  });

  // Buang baris kosong terakhir.
  if (lines.at(-1)?.text === "") {
    lines.pop();
  }

  rule();

  // RINCIAN PEMBAYARAN
  row("Subtotal", formatRupiah(tx.subtotal));
  row(`PPN (${tx.ppnRate}%)`, formatRupiah(tx.ppnAmount));

  rule();

  row(
    "TOTAL BAYAR",
    formatRupiah(tx.total),
    { bold: true }
  );

  row(
    tx.paymentMethod === "CASH" ? "Tunai" : "Non Tunai",
    formatRupiah(tx.amountReceived)
  );

  if (tx.paymentMethod === "CASH") {
    row("Kembalian", formatRupiah(tx.changeAmount));
  }

  rule("=");

  // FOOTER
  wrapText(STORE.footer, cols).forEach((text) => {
    add(text.trim(), { align: "center" });
  });

  wrapText(STORE.website, cols).forEach((text) => {
    add(text, { align: "center" });
  });

  wrapText(`Ig & Tiktok ${STORE.instagram}`, cols).forEach(
    (text) => {
      add(text, { align: "center" });
    }
  );

  wrapText(STORE.slogan, cols).forEach((text) => {
    add(text, { align: "center" });
  });

  return lines;
}