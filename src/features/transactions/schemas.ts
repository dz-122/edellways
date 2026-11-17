import { z } from "zod";
import { PAYMENT_METHODS } from "./constants";

export const createTransactionSchema = z.object({
  cashierName: z.string().trim().min(1, "Nama kasir wajib diisi.").max(80, "Nama kasir maksimal 80 karakter."),
  customerName: z.string().trim().max(80, "Nama pelanggan maksimal 80 karakter.").transform((v) => v || null),
  paymentMethod: z.enum(PAYMENT_METHODS, "Pilih metode pembayaran."),
  amountReceived: z.number().int().min(0),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int("Quantity harus bilangan bulat.").min(1, "Quantity harus lebih dari 0.").max(999),
        note: z.string().trim().max(200, "Catatan maksimal 200 karakter.").transform((v) => v || null),
      })
    )
    .min(1, "Tambahkan minimal satu produk."),
});

export type CreateTransactionInput = z.input<typeof createTransactionSchema>;
