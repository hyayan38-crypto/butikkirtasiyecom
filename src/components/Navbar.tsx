"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X, Search, BookOpen } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export default function Navbar() {
  const { data: session } = useSession();
  const itemCount = useCart((s) => s.itemCount());
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Kalem & Defter", slug: "kalem-defter" },
    { name: "Boya & Sanat", slug: "boya-sanat" },
    { name: "Okul Çantası", slug: "okul-cantasi" },
    { name: "Oyuncak", slug: "oyuncak" },
    { name: "Ofis", slug: "ofis" },
    { name: "Kampanya", slug: "kampanya" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-pink-600 text-white text-xs text-center py-1.5 px-4">
        Kargo bedava! 500₺ ve üzeri siparişlerde ücretsiz kargo 🎉
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <BookOpen className="w-7 h-7 text-pink-600" />
            <span className="font-bold text-xl text-gray-800">
              Butiik <span className="text-pink-600">Kırtasiye</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3">
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
                  className="border rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)}>
                <Search className="w-5 h-5 text-gray-600 hover:text-pink-600 transition-colors" />
              </button>
            )}

            {/* Cart */}
            <Link href="/sepet" className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-pink-600 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-600">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">{session.user?.name?.split(" ")[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg border w-44 py-1 hidden group-hover:block z-50">
                  <Link href="/hesabim" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Hesabım
                  </Link>
                  <Link href="/hesabim/siparisler" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Siparişlerim
                  </Link>
                  {(session.user as { role?: string })?.role === "admin" && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-pink-600 hover:bg-gray-50">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/giris"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-600"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block">Giriş</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t px-4 pb-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              className="block py-2.5 text-sm text-gray-700 border-b"
              onClick={() => setMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
