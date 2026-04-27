import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1E] text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8 pb-8 border-b border-[#2C2C2E]">
          {/* Brand */}
          <div className="md:col-span-2">
            <Image
              src="/logo.jpg"
              alt="Butik Kırtasiye"
              width={200}
              height={50}
              className="h-10 w-auto rounded-md mb-3"
            />
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-4">
              Kırtasiye, okul malzemeleri, boya & sanat ve oyuncak kategorilerinde geniş ürün yelpazesi. Hızlı kargo, güvenli ödeme.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#2C2C2E] rounded-lg flex items-center justify-center hover:bg-[#F5A623] hover:text-[#1C1C1E] text-gray-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#2C2C2E] rounded-lg flex items-center justify-center hover:bg-[#F5A623] hover:text-[#1C1C1E] text-gray-400 transition-colors text-sm font-bold"
              >
                TT
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider">Kategoriler</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["Kırtasiye", "/kategori/kirtasiye"],
                ["Boya & Sanat", "/kategori/boya-sanat"],
                ["Kalem & Defter", "/kategori/kalem-defter"],
                ["Okul Çantası", "/kategori/okul-cantasi"],
                ["Oyuncak", "/kategori/oyuncak"],
                ["Ofis Malzemeleri", "/kategori/ofis"],
                ["Kitap", "/kategori/kitap"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#F5A623] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider">Yardım</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["Sipariş Takibi", "/hesabim/siparisler"],
                ["İade & Değişim", "/iade-politikasi"],
                ["Kargo Bilgisi", "/kargo-bilgisi"],
                ["Sıkça Sorulanlar", "/sss"],
                ["İletişim", "/iletisim"],
                ["Hakkımızda", "/hakkimizda"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#F5A623] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F5A623] shrink-0" />
                <span>butikkirtasiye@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F5A623] shrink-0" />
                <span>0212 XXX XX XX</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>

            {/* Fiyat Gör kiosk */}
            <Link
              href="/fiyat-gor"
              className="mt-5 flex items-center gap-2 text-xs text-[#F5A623]/70 hover:text-[#F5A623] transition-colors"
            >
              <span>📷</span>
              <span>Barkod ile Fiyat Öğren</span>
            </Link>
          </div>
        </div>

        {/* Payment icons placeholder */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Butik Kırtasiye. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="bg-[#2C2C2E] px-2 py-1 rounded">VISA</span>
            <span className="bg-[#2C2C2E] px-2 py-1 rounded">Mastercard</span>
            <span className="bg-[#2C2C2E] px-2 py-1 rounded">İyzico</span>
            <span className="bg-[#2C2C2E] px-2 py-1 rounded">SSL 🔒</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
