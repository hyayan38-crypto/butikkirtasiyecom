import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import FiyatGorSection from "@/components/FiyatGorSection";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from "lucide-react";

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { featured: true, active: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

const STATIC_CATEGORIES = [
  { name: "Kalem & Defter", slug: "kalem-defter", emoji: "🖊️", color: "bg-orange-50" },
  { name: "Boya & Sanat", slug: "boya-sanat", emoji: "🎨", color: "bg-purple-50" },
  { name: "Okul Çantası", slug: "okul-cantasi", emoji: "🎒", color: "bg-blue-50" },
  { name: "Oyuncak", slug: "oyuncak", emoji: "🧸", color: "bg-yellow-50" },
  { name: "Ofis", slug: "ofis", emoji: "📎", color: "bg-green-50" },
  { name: "Kampanya", slug: "kampanya", emoji: "🏷️", color: "bg-red-50" },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1C1C1E]">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-10 text-center">
          {/* Logo as hero banner */}
          <div className="mb-6">
            <Image
              src="/logo.jpg"
              alt="Butik Kırtasiye"
              width={500}
              height={125}
              className="w-full max-w-sm mx-auto rounded-xl shadow-2xl"
              priority
            />
          </div>

          <p className="text-gray-400 text-base mb-6 leading-relaxed">
            Kırtasiye, okul malzemeleri ve oyuncakta en geniş koleksiyon.
            Hızlı kargo, güvenli ödeme.
          </p>

          <div className="flex gap-3 justify-center">
            <Link
              href="/urunler"
              className="flex-1 max-w-[160px] bg-[#F5A623] text-[#1C1C1E] px-5 py-3.5 rounded-xl font-bold hover:bg-[#e09520] transition-colors flex items-center justify-center gap-2 text-sm"
            >
              Alışverişe Başla
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/kategori/kampanya"
              className="flex-1 max-w-[160px] border border-[#F5A623]/40 text-[#F5A623] px-5 py-3.5 rounded-xl font-bold hover:bg-[#F5A623]/10 transition-colors text-center text-sm"
            >
              Kampanyalar
            </Link>
          </div>
        </div>

        {/* Desktop hero layout */}
        <div className="hidden lg:block max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-16">
            <div className="flex-1">
              <Image
                src="/logo.jpg"
                alt="Butik Kırtasiye"
                width={500}
                height={125}
                className="w-full max-w-md rounded-xl shadow-2xl"
                priority
              />
              <p className="text-gray-400 text-lg mt-5 mb-6 leading-relaxed max-w-md">
                Kırtasiye, okul malzemeleri ve oyuncakta en geniş koleksiyon.
                Hızlı kargo, güvenli ödeme.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/urunler"
                  className="bg-[#F5A623] text-[#1C1C1E] px-6 py-3.5 rounded-xl font-bold hover:bg-[#e09520] transition-colors flex items-center gap-2"
                >
                  Alışverişe Başla
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/kategori/kampanya"
                  className="border border-[#F5A623]/40 text-[#F5A623] px-6 py-3.5 rounded-xl font-bold hover:bg-[#F5A623]/10 transition-colors"
                >
                  Kampanyalar
                </Link>
              </div>
            </div>
            <div className="flex-1 text-center text-9xl select-none filter drop-shadow-lg">
              📚🖊️<br />🎨🧸
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-gray-100 py-5 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "Ücretsiz Kargo", desc: "500₺ üzeri", color: "text-[#F5A623]", bg: "bg-orange-50" },
            { icon: Shield, title: "Güvenli Ödeme", desc: "256-bit SSL", color: "text-green-600", bg: "bg-green-50" },
            { icon: RefreshCw, title: "Kolay İade", desc: "14 gün içinde", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Headphones, title: "Canlı Destek", desc: "7/24 hizmet", color: "text-purple-600", bg: "bg-purple-50" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex items-center gap-3">
              <div className={`${bg} p-2.5 rounded-xl shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fiyat Öğren */}
      <FiyatGorSection />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Kategoriler</h2>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {STATIC_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              className={`group ${cat.color} rounded-2xl p-3 text-center hover:shadow-md hover:scale-105 transition-all duration-200 active:scale-95`}
            >
              <div className="text-3xl mb-1.5">{cat.emoji}</div>
              <p className="font-semibold text-xs text-gray-700 leading-tight">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Öne Çıkan Ürünler</h2>
          <Link
            href="/urunler"
            className="text-[#F5A623] text-sm font-semibold hover:underline flex items-center gap-1"
          >
            Tümünü Gör <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-400">Henüz ürün eklenmemiş.</p>
            <Link
              href="/admin/urunler/yeni"
              className="text-[#F5A623] text-sm mt-2 inline-block hover:underline"
            >
              İlk ürünü ekle →
            </Link>
          </div>
        )}
      </section>

      {/* Promo banner */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="bg-[#1C1C1E] rounded-3xl p-7 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#F5A623] rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#F5A623] rounded-full"></div>
          </div>
          <div className="relative">
            <span className="inline-block bg-[#F5A623]/20 text-[#F5A623] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              Özel Fırsat
            </span>
            <h2 className="text-xl font-bold text-white mb-2">Okul Sezonuna Hazır mısın?</h2>
            <p className="text-gray-400 mb-5 text-sm">
              Tüm okul malzemelerinde %20 indirim!
            </p>
            <Link
              href="/kategori/kampanya"
              className="bg-[#F5A623] text-[#1C1C1E] px-6 py-3 rounded-xl font-bold hover:bg-[#e09520] transition-colors inline-block text-sm"
            >
              Kampanyayı Gör
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
