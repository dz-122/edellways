import type { Metadata } from "next";
import { DM_Sans, Fraunces, Parisienne } from "next/font/google";
import { CartProvider } from "@/features/cart/cart-provider";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import { SiteFooter } from "@/features/storefront/components/site-footer";
import { SiteHeader } from "@/features/storefront/components/site-header";
import { WhatsAppFab } from "@/features/storefront/components/whatsapp-fab";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-parisienne",
});

export const metadata: Metadata = {
  title: {
    default: "Edellways Florist Ambon",
    template: "%s · Edellways",
  },
  description:
    "Edellways Florist Ambon menyediakan bouquet, hampers, dan giftbox untuk berbagai momen spesial.",
  robots: { index: true, follow: true },
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${fraunces.variable} ${dmSans.variable} ${parisienne.variable} min-h-screen bg-cream font-body text-ink`}
    >
      <CartProvider>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <CartDrawer />
        <WhatsAppFab />
      </CartProvider>
    </div>
  );
}
