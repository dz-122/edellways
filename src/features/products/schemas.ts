import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi.").max(120, "Nama produk maksimal 120 karakter."),
  description: z.string().trim().max(2000, "Deskripsi maksimal 2000 karakter."),
  image: z.string().trim().refine((v) => v === "" || v.startsWith("https://"), "URL gambar harus diawali https://"),
  categoryId: z.string().transform((v) => v || null),
  occasionIds: z.array(z.string().min(1)).max(20, "Terlalu banyak acara dipilih."),
  price: z.coerce.number().int("Harga harus angka bulat.").min(0, "Harga tidak boleh negatif."),
  badge: z.string().trim().max(40, "Badge maksimal 40 karakter."),
  isActive: z.boolean(),
  soldOut: z.boolean(),
});