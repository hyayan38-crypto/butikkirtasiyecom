"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice, getProductImages } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: string;
  stock: number;
  category: { name: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const images = getProductImages(product.images);
  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (product.stock < 1) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: images[0],
      slug: product.slug,
      stock: product.stock,
    });
    toast("Sepete eklendi!");
  }

  return (
    <Link href={`/urun/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={images[0]}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              %{Math.round((1 - product.salePrice! / product.price) * 100)} İndirim
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-gray-500 font-medium text-sm">Stok Yok</span>
            </div>
          )}
          <button
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity hover:text-pink-600"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-gray-400 mb-1">{product.category.name}</p>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-900">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through ml-1.5">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
