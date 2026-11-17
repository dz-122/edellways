import { buildReceiptLines } from "@/features/printing/receipt-lines";
import { cn } from "@/lib/utils";
import type { TransactionView } from "../types";

type ReceiptProps = { tx: TransactionView; cols?: number };

/** Preview memakai baris yang sama persis dengan yang dikirim ke printer thermal. */
export function Receipt({ tx, cols = 32 }: ReceiptProps) {
  const lines = buildReceiptLines(tx, cols);
  return (
    <div className="overflow-x-auto bg-white">
      <div
        id="receipt"
        className="mx-auto bg-white p-3 font-mono text-[12px] leading-[1.35] text-black"
        style={{ width: `calc(${cols}ch + 1.5rem)` }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn("whitespace-pre", line.bold && "font-bold", line.large && "text-[1.6em] leading-tight")}
            style={{ textAlign: line.align === "center" ? "center" : "left" }}
          >
            {line.text || "\u00A0"}
          </div>
        ))}
      </div>
    </div>
  );
}
