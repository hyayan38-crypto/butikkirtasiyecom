import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, ORDER_STATUS, ORDER_STATUS_COLOR } from "@/lib/utils";
import { Package, Users, ShoppingBag, TrendingUp, Plus, ChevronRight } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "admin") redirect("/");

  const [productCount, userCount, orders, revenue] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: true },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: "paid" },
      _sum: { total: true },
    }),
  ]);

  const stats = [
    { icon: ShoppingBag, label: "Ürün", value: productCount, href: "/admin/urunler", color: "bg-blue-50 text-blue-600" },
    { icon: Users, label: "Müşteri", value: userCount, href: "/admin/kullanicilar", color: "bg-green-50 text-green-600" },
    { icon: Package, label: "Sipariş", value: orders.length, href: "/admin/siparisler", color: "bg-purple-50 text-purple-600" },
    { icon: TrendingUp, label: "Gelir", value: formatPrice(revenue._sum.total ?? 0), href: "/admin/siparisler", color: "bg-pink-50 text-pink-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <Link
          href="/admin/urunler/yeni"
          className="bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-pink-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ürün Ekle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
          >
            <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Ürün Ekle", href: "/admin/urunler/yeni", desc: "Yeni ürün oluştur" },
          { label: "Ürünleri Yönet", href: "/admin/urunler", desc: "Stok & fiyat güncelle" },
          { label: "Siparişler", href: "/admin/siparisler", desc: "Sipariş durumu güncelle" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-pink-200 hover:shadow-sm transition-all flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-pink-400 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Son Siparişler</h2>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Henüz sipariş yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b">
                  <th className="pb-3 font-medium">Sipariş No</th>
                  <th className="pb-3 font-medium">Müşteri</th>
                  <th className="pb-3 font-medium">Tarih</th>
                  <th className="pb-3 font-medium">Tutar</th>
                  <th className="pb-3 font-medium">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <Link href={`/admin/siparisler/${order.id}`} className="text-pink-600 hover:underline font-medium">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-600">{order.user.name}</td>
                    <td className="py-3 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${ORDER_STATUS_COLOR[order.status]}`}>
                        {ORDER_STATUS[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
