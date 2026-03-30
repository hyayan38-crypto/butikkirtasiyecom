import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-6 h-6 text-pink-400" />
            <span className="font-bold text-white text-lg">Butiik Kırtasiye</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Okul malzemeleri, kırtasiye ve oyuncak kategorilerinde geniş ürün yelpazesi.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-white mb-3">Kategoriler</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["Kalem & Defter", "/kategori/kalem-defter"],
              ["Boya & Sanat", "/kategori/boya-sanat"],
              ["Okul Çantası", "/kategori/okul-cantasi"],
              ["Oyuncak", "/kategori/oyuncak"],
              ["Ofis", "/kategori/ofis"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-pink-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold text-white mb-3">Yardım</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["Sipariş Takibi", "/hesabim/siparisler"],
              ["İade & Değişim", "/iade-politikasi"],
              ["Kargo Bilgisi", "/kargo-bilgisi"],
              ["Sıkça Sorulan Sorular", "/sss"],
              ["İletişim", "/iletisim"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-pink-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-white mb-3">İletişim</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-pink-400 shrink-0" />
              butikkirtasiye@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-pink-400 shrink-0" />
              0212 XXX XX XX
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              İstanbul, Türkiye
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} Butiik Kırtasiye. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
