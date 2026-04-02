import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1E] text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Logo */}
        <div className="mb-8 pb-6 border-b border-[#2C2C2E]">
          <Image
            src="/logo.jpg"
            alt="Butik Kırtasiye"
            width={200}
            height={50}
            className="h-10 w-auto rounded-md mb-3"
          />
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            Okul malzemeleri, kırtasiye ve oyuncak kategorilerinde geniş ürün yelpazesi.
          </p>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider">Kategoriler</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Kalem & Defter", "/kategori/kalem-defter"],
                ["Boya & Sanat", "/kategori/boya-sanat"],
                ["Okul Çantası", "/kategori/okul-cantasi"],
                ["Oyuncak", "/kategori/oyuncak"],
                ["Ofis", "/kategori/ofis"],
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
            <ul className="space-y-2.5 text-sm">
              {[
                ["Sipariş Takibi", "/hesabim/siparisler"],
                ["İade & Değişim", "/iade-politikasi"],
                ["Kargo Bilgisi", "/kargo-bilgisi"],
                ["Sıkça Sorulan Sorular", "/sss"],
                ["İletişim", "/iletisim"],
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
          <div className="col-span-2 md:col-span-2">
            <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F5A623] shrink-0" />
                butikkirtasiye@gmail.com
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F5A623] shrink-0" />
                0212 XXX XX XX
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                İstanbul, Türkiye
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2C2C2E] text-center text-xs text-gray-600 py-4">
        © {new Date().getFullYear()} Butik Kırtasiye. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
