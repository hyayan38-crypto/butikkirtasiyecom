"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
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
  const discountPct = hasDiscount
    ? Math.round((1 - product.salePrice! / product.price) * 100)
    : 0;

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
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#F5A623]/40 hover:shadow-lg transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-square bg-[#F9F6F0] overflow-hidden">
          <Image
            src={images[0]}
            alt={product.name}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-[#F5A623] text-[#1C1C1E] text-xs font-bold px-2 py-0.5 rounded-full">
              %{discountPct} İndirim
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="text-gray-500 font-semibold text-sm bg-white px-3 py-1 rounded-full border">
                Stok Yok
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-gray-400 mb-1 line-clamp-1">{product.category.name}</p>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-3 min-h-[2.5rem] leading-snug">
            {product.name}
          </h3>

          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="font-bold text-[#1C1C1E] text-base">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through ml-1.5 block">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="shrink-0 w-9 h-9 rounded-xl bg-[#F5A623] text-[#1C1C1E] hover:bg-[#e09520] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
