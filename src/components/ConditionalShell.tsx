"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const KIOSK_ROUTES = ["/fiyat-gor"];

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isKiosk = KIOSK_ROUTES.some((r) => pathname.startsWith(r));

  if (isKiosk) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#F9F6F0]">{children}</main>
      <Footer />
    </>
  );
}
