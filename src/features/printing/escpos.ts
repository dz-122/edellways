import type { ReceiptLine } from "./receipt-lines";

const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;

/**
 * Konversi teks agar kompatibel dengan printer thermal
 * standar yang menggunakan karakter ASCII.
 */
export function toPrinterText(text: string): string {
  return text
    .replace(/[\u00A0\u202F]/g, " ")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "?");
}

/**
 * Encode struk menjadi perintah ESC/POS.
 */
export function encodeReceipt(
  lines: ReceiptLine[],
  options: { cut?: boolean } = {}
): Uint8Array {
  const out: number[] = [];

  // Reset printer.
  out.push(ESC, 0x40);

  for (const line of lines) {
    // Alignment.
    out.push(
      ESC,
      0x61,
      line.align === "center" ? 1 : 0
    );

    // Bold.
    out.push(
      ESC,
      0x45,
      line.bold ? 1 : 0
    );

    // Font size.
    // 0x00 = normal.
    // 0x11 = double width + double height.
    out.push(
      GS,
      0x21,
      line.large ? 0x11 : 0x00
    );

    const text = toPrinterText(line.text);

    for (const char of text) {
      out.push(char.charCodeAt(0));
    }

    out.push(LF);
  }

  // Reset format.
  out.push(
    ESC, 0x61, 0,
    ESC, 0x45, 0,
    GS, 0x21, 0
  );

  // Feed 3 baris.
  out.push(ESC, 0x64, 3);

  // Cut paper.
  // Printer tanpa auto cutter biasanya mengabaikannya.
  if (options.cut ?? true) {
    out.push(GS, 0x56, 0x42, 0x00);
  }

  return Uint8Array.from(out);
}