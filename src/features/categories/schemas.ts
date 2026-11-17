import { z } from "zod";
import { CATEGORY_TYPES } from "./constants";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi.").max(60, "Nama maksimal 60 karakter."),
  type: z.enum(CATEGORY_TYPES),
});