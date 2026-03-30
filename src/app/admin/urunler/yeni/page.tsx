"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "0",
    categoryId: "",
    featured: false,
  });

  useEffect(() => {
    fetch("/api/admin/kategoriler").then((r) => r.json()).then(setCategories);
  }, []);

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: slugify(name) }));
  }

  function addImage() {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.categoryId) { setError("Kategori seçin."); return; }
    if (images.length === 0) { setError("En az bir ürün görseli ekleyin."); return; }

    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/urunler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        stock: parseInt(form.stock),
        images: JSON.stringify(images),
      }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Hata oluştu."); setLoading(false); return; }
    router.push("/admin/urunler");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/urunler" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Temel Bilgiler</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="ör. Staedtler Triplus Fineliner 20'li Set"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL (Slug)</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 font-mono text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              placeholder="Ürün açıklaması..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="">Seçin...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & stock */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Fiyat & Stok</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Normal Fiyat (₺) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İndirimli Fiyat (₺)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.salePrice}
                onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Boş bırakın"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Adedi *</label>
              <input
                type="number"
                required
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded text-pink-600"
            />
            <span className="text-sm text-gray-700">Öne Çıkan ürün olarak göster</span>
          </label>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Ürün Görselleri</h2>

          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
              className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Görsel URL yapıştırın (https://...)"
            />
            <button
              type="button"
              onClick={addImage}
              className="bg-pink-50 text-pink-600 px-4 py-2.5 rounded-xl hover:bg-pink-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt=""
                    className="w-20 h-20 object-contain rounded-xl border bg-gray-50"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-product.png"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400">Ürün görselinin URL&apos;sini ekleyin. İlk görsel ana görsel olarak kullanılır.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Kaydediliyor..." : "Ürünü Kaydet"}
        </button>
      </form>
    </div>
  );
}
