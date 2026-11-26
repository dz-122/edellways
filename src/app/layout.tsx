import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppToaster } from "@/components/shared/app-toaster";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: { default: "Edellways Admin", template: "%s · Edellways Admin" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={jakarta.variable}>
      <body className="font-sans antialiased">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}