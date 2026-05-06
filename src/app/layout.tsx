import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";
import { SessionProvider } from "next-auth/react";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Butik Kırtasiye - Kırtasiye, Sanat & Oyuncak",
    template: "%s | Butik Kırtasiye",
  },
  description:
    "Butik Kırtasiye — kırtasiye, boya & sanat, okul çantası ve oyuncak. WhatsApp, Instagram veya telefon ile ulaşın.",
  keywords: ["kırtasiye", "okul malzemeleri", "boya sanat", "oyuncak", "istanbul", "butik kırtasiye"],
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
