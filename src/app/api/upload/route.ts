import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/session";
import { isCloudinaryConfigured, uploadProductImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 4 * 1024 * 1024; // 4 MB (batas body di Vercel ~4.5 MB)

const error = (message: string, status: number) => NextResponse.json({ error: message }, { status });

export async function POST(req: Request) {
  if (!(await getSession())) return error("Tidak diizinkan.", 401);
  if (!isCloudinaryConfigured()) return error("Cloudinary belum diatur. Isi CLOUDINARY_* di .env.", 500);

  const file = (await req.formData()).get("file");
  if (!(file instanceof File)) return error("File tidak ditemukan.", 400);
  if (!ALLOWED_TYPES.includes(file.type)) return error("Format harus JPG, PNG, atau WebP.", 400);
  if (file.size > MAX_SIZE) return error("Ukuran maksimal 4 MB.", 400);

  try {
    const { url } = await uploadProductImage(Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url });
  } catch(err) {
    console.log(err, "<===")
    return error("Upload ke Cloudinary gagal. Coba lagi.", 502);
  }
}
