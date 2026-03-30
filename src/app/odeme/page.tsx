"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { Lock, ChevronRight } from "lucide-react";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: session?.user?.name ?? "",
    phone: "",
    city: "",
    district: "",
    address: "",
    notes: "",
  });

  const subtotal = total();
  const shipping = subtotal >= 500 ? 0 : 49.9;
  const grand = subtotal + shipping;

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Lock className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">Giriş Gerekli</h1>
        <p className="text-gray-400 text-sm mb-6">
          Ödeme yapabilmek için giriş yapmalısınız.
        </p>
        <Link
          href="/giris"
          className="bg-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-pink-700 transition-colors inline-flex items-center gap-2"
        >
          Giriş Yap <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    router.push("/sepet");
    return null;
  }

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.district || !form.address) {
      setError("Lütfen tüm adres alanlarını doldurun.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/siparisler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, quantity: i.quantity, name: i.name })),
        address: {
          name: form.name,
          phone: form.phone,
          city: form.city,
          district: form.district,
          address: form.address,
        },
        paymentMethod: "card",
        notes: form.notes,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Sipariş oluşturulamadı.");
      setLoading(false);
      return;
    }

    clearCart();
    router.push(`/hesabim/siparisler/${data.orderId}?success=1`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ödeme</h1>

      <form onSubmit={handleOrder}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Address form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Teslimat Adresi</h2>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="05XX XXX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İl *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="İstanbul"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İlçe *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.district}
                    onChange={(e) =>
                      setForm({ ...form, district: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Kadıköy"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adres *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                    placeholder="Mahalle, cadde, sokak, bina no, daire no..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sipariş Notu (Opsiyonel)
                  </label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                    placeholder="Kargocuya not..."
                  />
                </div>
              </div>
            </div>

            {/* Payment notice */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Ödeme Yöntemi</h2>
              <div className="flex items-center gap-3 bg-pink-50 rounded-xl p-4">
                <Lock className="w-5 h-5 text-pink-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Güvenli Ödeme (İyzico)
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Ödemeniz 256-bit SSL ile korunmaktadır. Kart bilgileriniz saklanmaz.
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                * Şu an demo modunda. Gerçek ödeme entegrasyonu için İyzico API anahtarlarını .env dosyasına ekleyin.
              </p>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">Sipariş Özeti</h2>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">
                      {item.name}{" "}
                      <span className="text-gray-400">x{item.quantity}</span>
                    </span>
                    <span className="font-medium shrink-0">
                      {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
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
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Toplam</span>
                  <span className="text-pink-600">{formatPrice(grand)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {loading ? "Sipariş oluşturuluyor..." : "Siparişi Tamamla"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
