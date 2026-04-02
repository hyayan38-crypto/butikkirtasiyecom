import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";
import { SessionProvider } from "next-auth/react";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Butiik Kırtasiye - Okul Malzemeleri & Oyuncak",
    template: "%s | Butiik Kırtasiye",
  },
  description:
    "Kırtasiye, okul malzemeleri ve oyuncak kategorilerinde geniş ürün yelpazesi. Hızlı kargo, güvenli ödeme.",
  keywords: ["kırtasiye", "okul malzemeleri", "kalem", "defter", "oyuncak"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${geist.className} bg-gray-50 min-h-screen flex flex-col`}>
        <SessionProvider>
          <ConditionalShell>{children}</ConditionalShell>
        </SessionProvider>
      </body>
    </html>
  );
}
