"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  const subtotal = total();
  const shipping = subtotal >= 500 ? 0 : 49.9;
  const grand = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-20 h-20 text-gray-200 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sepetiniz Boş</h1>
        <p className="text-gray-400 mb-8">
          Alışverişe başlamak için ürün ekleyin.
        </p>
        <Link
          href="/urunler"
          className="bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors inline-flex items-center gap-2"
        >
          Alışverişe Başla <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sepetim ({itemCount()} ürün)
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.salePrice ?? item.price;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4"
              >
                <div className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/urun/${item.slug}`}
                    className="font-medium text-gray-800 hover:text-pink-600 line-clamp-2 text-sm"
                  >
                    {item.name}
                  </Link>
                  <p className="text-pink-600 font-bold mt-1">
                    {formatPrice(price)}
                    {item.salePrice && (
                      <span className="text-gray-400 text-xs font-normal line-through ml-2">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center border rounded-lg text-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 hover:text-pink-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.min(item.stock, item.quantity + 1)
                        )
                      }
                      className="px-2 py-1 hover:text-pink-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {formatPrice(price * item.quantity)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Sipariş Özeti</h2>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Ara Toplam</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kargo</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">
                  {formatPrice(500 - subtotal)} daha ekleyin, kargo bedava!
                </p>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Toplam</span>
                <span className="text-pink-600">{formatPrice(grand)}</span>
              </div>
            </div>

            <Link
              href="/odeme"
              className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
            >
              Ödemeye Geç <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/urunler"
              className="w-full text-center text-sm text-gray-400 hover:text-pink-600 mt-3 block"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
