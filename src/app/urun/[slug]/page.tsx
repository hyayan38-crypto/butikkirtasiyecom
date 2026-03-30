"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Minus, Plus, Truck, Shield } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice, getProductImages } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  images: string;
  category: { name: string; slug: string };
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const addItem = useCart((s) => s.addItem);

  useEffect(() => {
    fetch(`/api/urunler/${params.slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
      </div>
    );

  if (!product)
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-gray-500">Ürün bulunamadı.</p>
        <Link href="/urunler" className="text-pink-600 mt-4 inline-block hover:underline">
          Ürünlere dön
        </Link>
      </div>
    );

  const images = getProductImages(product.images);
  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountRate = hasDiscount
    ? Math.round((1 - product.salePrice! / product.price) * 100)
    : 0;

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product!.id,
        name: product!.name,
        price: product!.price,
        salePrice: product!.salePrice,
        image: images[0],
        slug: product!.slug,
        stock: product!.stock,
      });
    }
    toast(`${qty} adet sepete eklendi!`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-pink-600">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/urunler" className="hover:text-pink-600">Ürünler</Link>
        <span>/</span>
        <Link href={`/kategori/${product.category.slug}`} className="hover:text-pink-600">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
            <Image
              src={images[activeImg]}
              alt={product.name}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                %{discountRate} İndirim
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition-colors ${
                    i === activeImg ? "border-pink-500" : "border-gray-200"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <Link
            href={`/kategori/${product.category.slug}`}
            className="text-sm text-pink-600 font-medium hover:underline"
          >
            {product.category.name}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600 text-sm font-medium">
                ✓ Stokta {product.stock > 10 ? "var" : `${product.stock} adet kaldı`}
              </span>
            ) : (
              <span className="text-red-500 text-sm font-medium">✗ Stok tükendi</span>
            )}
          </div>

          {/* Quantity + Add */}
          {product.stock > 0 && (
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border rounded-xl">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2.5 hover:text-pink-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="px-3 py-2.5 hover:text-pink-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 bg-pink-600 text-white py-2.5 rounded-xl font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Sepete Ekle
              </button>
            </div>
          )}

          {/* Info boxes */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <Truck className="w-5 h-5 text-pink-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">Hızlı Kargo</p>
                <p className="text-xs text-gray-400">500₺ üzeri ücretsiz kargo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <Shield className="w-5 h-5 text-pink-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">Güvenli Ödeme</p>
                <p className="text-xs text-gray-400">256-bit SSL ile korumalı</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
