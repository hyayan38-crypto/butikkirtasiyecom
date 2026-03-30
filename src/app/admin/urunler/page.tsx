import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Package } from "lucide-react";

export default async function AdminProductsPage() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "admin") redirect("/");

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
        <Link
          href="/admin/urunler/yeni"
          className="bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-pink-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ürün Ekle
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">Henüz ürün yok.</p>
          <Link href="/admin/urunler/yeni" className="text-pink-600 text-sm mt-2 inline-block hover:underline">
            İlk ürünü ekle
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Ürün</th>
                <th className="px-4 py-3 text-left font-medium">Kategori</th>
                <th className="px-4 py-3 text-left font-medium">Fiyat</th>
                <th className="px-4 py-3 text-left font-medium">Stok</th>
                <th className="px-4 py-3 text-left font-medium">Durum</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product.category.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{formatPrice(product.salePrice ?? product.price)}</span>
                    {product.salePrice && (
                      <span className="text-xs text-gray-400 line-through ml-1">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      product.active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {product.active ? "Aktif" : "Pasif"}
                    </span>
                    {product.featured && (
                      <span className="ml-1 text-xs px-2 py-1 rounded-full font-medium bg-yellow-50 text-yellow-700">
                        Öne Çıkan
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/urunler/${product.id}/duzenle`}
                      className="text-gray-400 hover:text-pink-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
