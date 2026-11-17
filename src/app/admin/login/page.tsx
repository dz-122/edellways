import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
        <svg aria-hidden viewBox="0 0 400 400" className="absolute -bottom-16 -right-16 h-[28rem] w-[28rem] text-white/10" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M200 380V160M200 260c-50-10-80-50-80-90 40 5 75 40 80 90zM200 220c40-10 70-45 72-85-38 5-68 40-72 85zM200 160c-25-20-30-55-10-90 25 25 30 60 10 90z" />
          <circle cx="200" cy="60" r="22" />
        </svg>
        <p className="font-serif text-3xl font-semibold tracking-wide">Edellways</p>
        <div className="relative max-w-md">
          <h1 className="font-serif text-5xl font-medium leading-tight">Kelola toko bunga dengan tenang.</h1>
          <p className="mt-4 text-sidebar-foreground/70">Produk, kasir, dan riwayat transaksi dalam satu tempat.</p>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <p className="mb-8 font-serif text-3xl font-semibold text-primary lg:hidden">Edellways</p>
          <h2 className="font-serif text-3xl font-semibold">Masuk ke dashboard</h2>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">Gunakan akun admin yang sudah terdaftar.</p>
          <LoginForm /> 
        </div>
      </section>
    </main>
  );
}
