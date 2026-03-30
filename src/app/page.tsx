import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
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
  { name: "Kalem & Defter", slug: "kalem-defter", emoji: "🖊️" },
  { name: "Boya & Sanat", slug: "boya-sanat", emoji: "🎨" },
  { name: "Okul Çantası", slug: "okul-cantasi", emoji: "🎒" },
  { name: "Oyuncak", slug: "oyuncak", emoji: "🧸" },
  { name: "Ofis", slug: "ofis", emoji: "📎" },
  { name: "Kampanya", slug: "kampanya", emoji: "🏷️" },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-pink-100 text-pink-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              🎉 Yeni sezon ürünleri geldi!
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Okula Hazırlanmak <br />
              <span className="text-pink-600">Hiç Bu Kadar Kolay</span> <br />
              Olmamıştı
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto lg:mx-0">
              Kırtasiye, okul malzemeleri ve oyuncakta en geniş koleksiyon.
              Hızlı kargo, güvenli ödeme.
            </p>
            <div className="flex gap-3 justify-center lg:justify-start flex-wrap">
              <Link
                href="/urunler"
                className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                Alışverişe Başla
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kategori/kampanya"
                className="border border-pink-200 text-pink-700 px-6 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-colors"
              >
                Kampanyalar
              </Link>
            </div>
          </div>
          <div className="flex-1 text-center text-8xl select-none">
            📚🖊️🎨🧸
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: "Ücretsiz Kargo", desc: "500₺ üzeri" },
            { icon: Shield, title: "Güvenli Ödeme", desc: "256-bit SSL" },
            { icon: RefreshCw, title: "Kolay İade", desc: "14 gün içinde" },
            { icon: Headphones, title: "Canlı Destek", desc: "7/24 hizmet" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="bg-pink-50 p-2.5 rounded-xl shrink-0">
                <Icon className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategoriler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATIC_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              className="group bg-white rounded-2xl p-4 text-center border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <p className="font-semibold text-sm text-gray-800 group-hover:text-pink-600 transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Öne Çıkan Ürünler
          </h2>
          <Link
            href="/urunler"
            className="text-pink-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            Tümünü Gör <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-400">Henüz ürün eklenmemiş.</p>
            <Link
              href="/admin/urunler/yeni"
              className="text-pink-600 text-sm mt-2 inline-block hover:underline"
            >
              İlk ürünü ekle →
            </Link>
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Okul Sezonuna Hazır mısın?</h2>
          <p className="text-pink-100 mb-6">
            Tüm okul malzemelerinde %20 indirim!
          </p>
          <Link
            href="/kategori/kampanya"
            className="bg-white text-pink-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-pink-50 transition-colors inline-block"
          >
            Kampanyayı Gör
          </Link>
        </div>
      </section>
    </div>
  );
}
