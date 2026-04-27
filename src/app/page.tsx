import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Truck, RotateCcw, ShieldCheck, ChevronRight } from "lucide-react";

const categories = [
  { name: "Kalem & Defter", slug: "kalem-defter", emoji: "🖊️", desc: "Tükenmez, kurşun kalem, defter" },
  { name: "Boya & Sanat", slug: "boya-sanat", emoji: "🎨", desc: "Suluboya, pastel, fırça" },
  { name: "Okul Çantası", slug: "okul-cantasi", emoji: "🎒", desc: "İlkokul, ortaokul, lise" },
  { name: "Oyuncak", slug: "oyuncak", emoji: "🧸", desc: "Eğitici, yaratıcı oyuncaklar" },
  { name: "Kırtasiye", slug: "kirtasiye", emoji: "📌", desc: "Makas, yapıştırıcı, dosya" },
  { name: "Ofis Malzemeleri", slug: "ofis", emoji: "📎", desc: "Zımba, delgeç, klasör" },
  { name: "Kitap", slug: "kitap", emoji: "📚", desc: "Hikaye, roman, eğitim kitabı" },
  { name: "Kampanya", slug: "kampanya", emoji: "🏷️", desc: "İndirimli ürünler" },
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
      <section className="relative bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#F5A623] blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-[#F5A623] blur-2xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-[#F5A623] text-[#1C1C1E] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              Yeni Sezon
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Okula Dönüş
              <br />
              <span className="text-[#F5A623]">Hazır mısın?</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Kalemden çantaya, boyadan kitaba — ihtiyacın olan her şey Butik Kırtasiye&apos;de.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                href="/urunler"
                className="bg-[#F5A623] text-[#1C1C1E] font-bold px-8 py-3.5 rounded-xl hover:bg-[#d48f1a] transition-colors inline-flex items-center justify-center gap-2"
              >
                Ürünleri Keşfet
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/kampanya"
                className="border border-[#F5A623]/40 text-[#F5A623] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#F5A623]/10 transition-colors inline-flex items-center justify-center"
              >
                Kampanyalar
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <div className="absolute inset-0 bg-[#F5A623]/20 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-[#F5A623]/10 rounded-3xl -rotate-3" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-[#F5A623]/20">
                <Image
                  src="/logo.jpg"
                  alt="Butik Kırtasiye"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
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

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Kategoriler</h2>
          <Link href="/urunler" className="text-sm text-[#F5A623] hover:underline font-medium flex items-center gap-1">
            Tümünü Gör <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              className="group bg-white rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all border border-gray-100"
            >
              <span className="text-3xl mb-2">{cat.emoji}</span>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-[#F5A623] transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Cards - Detailed */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large card */}
          <Link
            href="/kategori/boya-sanat"
            className="group relative md:col-span-2 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-3xl overflow-hidden h-52 flex items-end p-6 hover:shadow-xl transition-shadow"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 right-4 text-9xl">🎨</div>
            </div>
            <div>
              <span className="text-[#F5A623] text-xs font-bold uppercase tracking-widest">Keşfet</span>
              <h3 className="text-white text-2xl font-bold mt-1">Sanat & Boya</h3>
              <p className="text-gray-400 text-sm mt-1">Yaratıcılığınızı keşfedin</p>
            </div>
            <ChevronRight className="absolute right-6 bottom-6 w-6 h-6 text-[#F5A623] group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Small cards */}
          <div className="flex flex-col gap-4">
            <Link
              href="/kategori/okul-cantasi"
              className="group relative bg-[#F5A623] rounded-3xl overflow-hidden h-24 flex items-end px-5 py-4 hover:shadow-xl transition-shadow"
            >
              <div className="absolute top-2 right-4 text-5xl opacity-30">🎒</div>
              <div>
                <h3 className="text-[#1C1C1E] text-lg font-bold">Okul Çantaları</h3>
              </div>
              <ChevronRight className="absolute right-4 bottom-4 w-5 h-5 text-[#1C1C1E]/60 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/kategori/oyuncak"
              className="group relative bg-gradient-to-br from-purple-900 to-purple-800 rounded-3xl overflow-hidden h-24 flex items-end px-5 py-4 hover:shadow-xl transition-shadow"
            >
              <div className="absolute top-2 right-4 text-5xl opacity-30">🧸</div>
              <div>
                <h3 className="text-white text-lg font-bold">Oyuncaklar</h3>
              </div>
              <ChevronRight className="absolute right-4 bottom-4 w-5 h-5 text-white/40 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Yakında - Öne Çıkan Ürünler */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Öne Çıkan Ürünler</h2>
        </div>
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

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-[#F5A623] to-[#d48f1a] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#1C1C1E] mb-2">
              500₺ ve üzeri siparişlerde
            </h3>
            <p className="text-[#1C1C1E]/70 text-lg font-medium">Ücretsiz Kargo!</p>
          </div>
          <Link
            href="/urunler"
            className="bg-[#1C1C1E] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-black transition-colors whitespace-nowrap flex items-center gap-2"
          >
            Hemen Alışveriş Yap
            <ChevronRight className="w-5 h-5" />
          </Link>
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
