"use client";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

export function AppToaster() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return <Toaster richColors position="top-right" />;

  return (
    <Toaster
      position="bottom-center"
      offset={{ bottom: 24 }}
      mobileOffset={{ bottom: 88, left: 16, right: 16 }} // 88px = di atas tombol WhatsApp
      visibleToasts={2}
      duration={2800}
      toastOptions={{
        classNames: {
          toast: "!rounded-2xl !border-black !bg-black !text-cream !shadow-xl",
          title: "!font-medium",
          description: "!text-cream/70",
          icon: "!text-gold",
        },
      }}
    />
  );
}