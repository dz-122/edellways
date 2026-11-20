import { LogOut } from "lucide-react";
import { AdminNav } from "@/components/layout/admin-nav";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions";
import { PrinterProvider } from "@/features/printing/components/printer-provider";
import { PrinterStatus } from "@/features/printing/components/printer-status";
import { requireSession } from "@/features/auth/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  const logoutForm = (
    <form action={logout}>
      <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white">
        <LogOut /> Keluar
      </Button>
    </form>
  );

  return (
    <PrinterProvider>
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-sidebar p-5 text-sidebar-foreground lg:flex">
        <p className="mb-8 px-3 font-brand text-4xl leading-none text-gold">Edellways</p>
        <AdminNav />
        <div className="mt-auto">
          <PrinterStatus />
        </div>
        <div className="border-t border-sidebar-border pt-4">
          <p className="truncate px-3 text-sm font-medium">{session.name}</p>
          <p className="mb-2 truncate px-3 text-xs text-sidebar-foreground/60">{session.email}</p>
          {logoutForm}
        </div>
      </aside>
      <div className="min-w-0">
        <header className="bg-sidebar pt-3 text-sidebar-foreground lg:hidden">
          <div className="flex items-center justify-between px-4 pb-2">
           <p className="font-brand text-3xl leading-none text-gold">Edellways</p>
            <div className="flex items-center">
              <PrinterStatus compact />
              {logoutForm}
            </div>
          </div>
          <AdminNav horizontal />
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
    </PrinterProvider>
  );
}
