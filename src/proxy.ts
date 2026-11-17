// Next.js 16: proxy.ts. Jika memakai Next.js 15, ganti nama file jadi middleware.ts
// dan nama fungsi `proxy` jadi `middleware`.
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const token = req.cookies.get("edw_session")?.value;

  let valid = false;
  if (token && process.env.AUTH_SECRET) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (!valid && !isLogin) return NextResponse.redirect(new URL("/admin/login", req.url));
  if (valid && isLogin) return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
