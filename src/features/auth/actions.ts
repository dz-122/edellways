"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "./session";

export type LoginState = { error: string } | null;

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Isi email."),
  password: z.string().min(1, "Isi password."),
});

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const admin = await prisma.admin.findUnique({ where: { email: parsed.data.email } });
  const valid = admin !== null && (await bcrypt.compare(parsed.data.password, admin.passwordHash));
  if (!admin || !valid) return { error: "Email atau password salah." };

  await createSession({ id: admin.id, name: admin.name, email: admin.email });
  redirect("/admin/dashboard");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
