# Edellways Admin

Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Prisma 6 · Neon Postgres · Cloudinary · Zod

## Setup
1. `npm install`
2. Salin `.env.example` → `.env`, isi:
   - `DATABASE_URL` (pooled) dan `DIRECT_URL` (direct) dari Neon
   - `AUTH_SECRET` (`openssl rand -base64 32`)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
3. Pasang komponen shadcn (sekali saja):
   `npx shadcn@latest add button input label card badge table dialog switch textarea sonner`
   (jika ditanya menimpa `globals.css`, pilih **No**)
4. `npx prisma db push` lalu `npm run db:seed`
5. `npm run dev` → `/admin/login`
6. Sebelum deploy: `npm run typecheck`

## Struktur
```
src/
├── app/                    # Routing saja: page/layout tipis
│   ├── admin/{login,dashboard,struk}
│   └── api/upload/route.ts # Upload gambar ke Cloudinary
├── features/               # Logika per domain (auth, products, categories, transactions, dashboard)
│   └── <domain>/
│       ├── actions.ts      # Server Actions ("use server")
│       ├── queries.ts      # Baca data (server-only)
│       ├── schemas.ts      # Validasi Zod
│       ├── types.ts
│       └── components/     # Komponen khusus domain
├── components/{ui,layout,shared}
├── lib/                    # prisma, cloudinary, format, utils, action-result
├── config/store.ts         # Info toko untuk struk, zona waktu
└── proxy.ts                # Proteksi route /admin
```
Konvensi: file kebab-case, komponen PascalCase, hook camelCase berawalan `use`, Server Action mengembalikan `ActionResult`.

## Catatan
- Next.js 15? Ganti `src/proxy.ts` → `src/middleware.ts` dan fungsi `proxy` → `middleware`.
- Public page sudah ada? Hapus `src/app/page.tsx` dan gabungkan `src/app/layout.tsx` dengan layout milikmu (font + `Toaster`).
- Upload gambar maksimal 4 MB (batas body Vercel). Gambar lama di Cloudinary tidak otomatis dihapus saat diganti.
- Tarif PPN: `src/features/transactions/constants.ts`. Verifikasi dengan status PKP sebelum produksi.
