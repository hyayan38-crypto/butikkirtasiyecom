"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X, Search, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const categories = [
  {
    name: "Kırtasiye",
    slug: "kirtasiye",
    emoji: "📌",
    sub: ["Kalem & Defter", "Makas & Yapıştırıcı", "Dosya & Klasör", "Silgi & Pergel"],
  },
  {
    name: "Boya & Sanat",
    slug: "boya-sanat",
    emoji: "🎨",
    sub: ["Suluboya", "Pastel & Kuru Boya", "Fırça & Paleti", "Resim Kağıdı"],
  },
  {
    name: "Okul Çantası",
    slug: "okul-cantasi",
    emoji: "🎒",
    sub: ["İlkokul Çantası", "Ortaokul Çantası", "Lise Çantası", "Kalemlik"],
  },
  {
    name: "Oyuncak",
    slug: "oyuncak",
    emoji: "🧸",
    sub: ["Eğitici Oyuncak", "Lego & Yapboz", "Peluş", "Masa Oyunları"],
  },
  {
    name: "Kalem & Defter",
    slug: "kalem-defter",
    emoji: "🖊️",
    sub: ["Tükenmez Kalem", "Kurşun Kalem", "Spiralli Defter", "Ajanda"],
  },
  {
    name: "Ofis",
    slug: "ofis",
    emoji: "📎",
    sub: ["Zımba & Delgeç", "Post-it", "Beyaz Tahta", "Hesap Makinesi"],
  },
  {
    name: "Kitap",
    slug: "kitap",
    emoji: "📚",
    sub: ["Hikaye Kitabı", "Boyama Kitabı", "Eğitim Seti", "Sözlük"],
  },
  {
    name: "Kampanya",
    slug: "kampanya",
    emoji: "🏷️",
    sub: ["Haftanın Fırsatları", "Sınırlı Stok", "Yeni Gelenler"],
  },
];

export default function Navbar() {
  const { data: session } = useSession();
  const itemCount = useCart((s) => s.itemCount());
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#F5A623] text-[#1C1C1E] text-xs text-center py-2 px-4 font-semibold">
        🎉 500₺ ve üzeri siparişlerde ücretsiz kargo!
      </div>

      {/* Main bar */}
      <div className="bg-[#1C1C1E] shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 gap-3">

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.jpg"
                alt="Butik Kırtasiye"
                width={160}
                height={40}
                className="h-9 w-auto rounded-md"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center relative">
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  className="relative"
                  onMouseEnter={() => setHoveredCat(cat.slug)}
                  onMouseLeave={() => setHoveredCat(null)}
                >
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="flex items-center gap-0.5 text-sm text-gray-300 hover:text-[#F5A623] transition-colors whitespace-nowrap px-2.5 py-2"
                  >
                    {cat.name}
                    <ChevronDown className="w-3 h-3 mt-0.5 opacity-50" />
                  </Link>
                  {/* Dropdown */}
                  {hoveredCat === cat.slug && (
                    <div className="absolute top-full left-0 mt-0.5 bg-[#2C2C2E] border border-[#3C3C3E] shadow-2xl rounded-xl w-48 py-2 z-50">
                      {cat.sub.map((sub) => (
                        <Link
                          key={sub}
                          href={`/kategori/${cat.slug}`}
                          className="block px-4 py-2 text-sm text-gray-300 hover:text-[#F5A623] hover:bg-[#3C3C3E] transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              {searchOpen ? (
                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim())
                      window.location.href = `/urunler?q=${encodeURIComponent(searchQuery)}`;
                  }}
                >
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ürün ara..."
                    className="bg-[#2C2C2E] text-white border border-[#F5A623]/30 rounded-lg px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-[#F5A623]"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)}>
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-300 hover:text-[#F5A623] transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* Cart */}
              <Link href="/sepet" className="relative p-2 text-gray-300 hover:text-[#F5A623] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#F5A623] text-[#1C1C1E] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>

              {/* User - desktop only */}
              {session ? (
                <div className="hidden lg:block relative group">
                  <button className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-[#F5A623] p-2 transition-colors">
                    <User className="w-5 h-5" />
                    <span>{session.user?.name?.split(" ")[0]}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-[#2C2C2E] border border-[#3C3C3E] shadow-xl rounded-xl w-44 py-1 hidden group-hover:block">
                    <Link href="/hesabim" className="block px-4 py-2.5 text-sm text-gray-300 hover:text-[#F5A623] hover:bg-[#3C3C3E]">
                      Hesabım
                    </Link>
                    <Link href="/hesabim/siparisler" className="block px-4 py-2.5 text-sm text-gray-300 hover:text-[#F5A623] hover:bg-[#3C3C3E]">
                      Siparişlerim
                    </Link>
                    {(session.user as { role?: string })?.role === "admin" && (
                      <Link href="/admin" className="block px-4 py-2.5 text-sm text-[#F5A623] hover:bg-[#3C3C3E]">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#3C3C3E]"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/giris"
                  className="hidden lg:flex items-center gap-1 text-sm text-gray-300 hover:text-[#F5A623] p-2 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Giriş</span>
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-gray-300 hover:text-[#F5A623] transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#1C1C1E] border-t border-[#2C2C2E] max-h-[80vh] overflow-y-auto">
          {/* User section */}
          <div className="px-4 py-3 border-b border-[#2C2C2E]">
            {session ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center">
                    <span className="text-[#1C1C1E] font-bold text-sm">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium">{session.user?.name}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs text-red-400"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <Link
                href="/giris"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between text-[#F5A623] font-medium py-1"
              >
                <span>Giriş Yap / Kayıt Ol</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Categories */}
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Kategoriler</p>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="flex items-center justify-between py-3 text-gray-300 hover:text-[#F5A623] border-b border-[#2C2C2E] last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </Link>
            ))}
          </div>

          {/* Account links for logged in users */}
          {session && (
            <div className="px-4 py-2 border-t border-[#2C2C2E]">
              <Link href="/hesabim" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3 text-gray-300">
                <span className="text-sm">Hesabım</span>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </Link>
              <Link href="/hesabim/siparisler" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3 text-gray-300">
                <span className="text-sm">Siparişlerim</span>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </Link>
              {(session.user as { role?: string })?.role === "admin" && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3 text-[#F5A623]">
                  <span className="text-sm font-medium">Admin Panel</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
