import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Truck, RotateCcw, ShieldCheck, ChevronRight } from "lucide-react";

const categories = [
  { name: "Kırtasiye", slug: "kirtasiye", img: "/kategori-kirtasiye.png" },
  { name: "Boya & Sanat", slug: "boya-sanat", img: "/kategori-boya-sanat.png" },
  { name: "Kalem & Defter", slug: "kalem-defter", img: "/kategori-kalem-defter.png" },
  { name: "Okul Çantası", slug: "okul-cantasi", img: "/kategori-okul-cantasi.png" },
  { name: "Oyuncak", slug: "oyuncak", img: "/kategori-oyuncak.png" },
  { name: "Ofis Malzemeleri", slug: "ofis", img: "/kategori-ofis.png" },
  { name: "Kitap", slug: "kitap", img: "/kategori-kitap.png" },
  { name: "Kampanya", slug: "kampanya", img: "/kategori-kampanya.png" },
];

const features = [
  { icon: Truck, title: "Ücretsiz Kargo", desc: "500₺ ve üzeri siparişlerde" },
  { icon: RotateCcw, title: "Kolay İade", desc: "14 gün içinde iade garantisi" },
  { icon: ShieldCheck, title: "Güvenli Ödeme", desc: "SSL şifreli güvenli alışveriş" },
  { icon: ShoppingBag, title: "Hızlı Teslimat", desc: "Aynı gün kargo imkanı" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0]">

      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden bg-[#1C1C1E]">
        <div className="relative w-full" style={{ aspectRatio: "820/312" }}>
          <Image
            src="/banner-hero.png"
            alt="Okula Dönüş - Butik Kırtasiye"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <span className="inline-block bg-[#F5A623] text-[#1C1C1E] text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit uppercase tracking-wide">
              Yeni Sezon
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
              Okula Dönüş<br />
              <span className="text-[#F5A623]">Hazır mısın?</span>
            </h1>
            <div className="flex gap-3 mt-2">
              <Link
                href="/urunler"
                className="bg-[#F5A623] text-[#1C1C1E] font-bold px-6 py-2.5 rounded-xl hover:bg-[#d48f1a] transition-colors text-sm flex items-center gap-1.5"
              >
                Keşfet <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kategori/kampanya"
                className="border border-white/50 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                Kampanyalar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 px-4 py-4">
                <div className="w-10 h-10 bg-[#F5A623]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#F5A623]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Kategoriler</h2>
          <Link href="/urunler" className="text-sm text-[#F5A623] hover:underline font-medium flex items-center gap-1">
            Tümünü Gör <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-white"
              style={{ aspectRatio: "1/1" }}
            >
              <Image
                src={cat.img}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold text-sm md:text-base drop-shadow">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banner - Kargo */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "820/312" }}>
          <Image
            src="/banner-kargo.png"
            alt="Ücretsiz Kargo"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-between px-8 md:px-14 py-6 gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
                500₺ ve üzeri siparişlerde
              </h3>
              <p className="text-[#F5A623] text-xl font-bold mt-1 drop-shadow">Ücretsiz Kargo!</p>
            </div>
            <Link
              href="/urunler"
              className="bg-[#F5A623] text-[#1C1C1E] font-bold px-8 py-3.5 rounded-xl hover:bg-[#d48f1a] transition-colors whitespace-nowrap flex items-center gap-2 shrink-0"
            >
              Hemen Alışveriş Yap <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Yakında - Öne Çıkan Ürünler */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Öne Çıkan Ürünler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center h-52 text-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">Yakında</p>
                <p className="text-gray-300 text-xs">Ürünler ekleniyor...</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fiyat Gör Kiosk Link */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <Link
          href="/fiyat-gor"
          className="flex items-center justify-between bg-white border border-[#F5A623]/20 rounded-2xl px-6 py-4 hover:border-[#F5A623]/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F5A623]/10 rounded-xl flex items-center justify-center text-2xl">
              📷
            </div>
            <div>
              <p className="font-semibold text-gray-800">Barkod ile Fiyat Öğren</p>
              <p className="text-sm text-gray-500">Kameranızla ürün barkodunu okutun</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#F5A623] group-hover:translate-x-1 transition-all" />
        </Link>
      </section>

    </div>
  );
}
