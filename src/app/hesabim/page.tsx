import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, ORDER_STATUS, ORDER_STATUS_COLOR } from "@/lib/utils";
import { Package, MapPin, User, ChevronRight } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  const userId = (session.user as { id: string }).id;

  const [orders, user] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, address: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hesabım</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Package, label: "Siparişlerim", href: "/hesabim/siparisler", count: orders.length },
          { icon: MapPin, label: "Adreslerim", href: "/hesabim/adresler", count: null },
          { icon: User, label: "Bilgilerimi Düzenle", href: "/hesabim/profil", count: null },
        ].map(({ icon: Icon, label, href, count }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-pink-200 hover:shadow-sm transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-pink-50 p-2.5 rounded-xl">
                <Icon className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{label}</p>
                {count !== null && (
                  <p className="text-xs text-gray-400">{count} sipariş</p>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-pink-400 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-900">Son Siparişler</h2>
          <Link href="/hesabim/siparisler" className="text-sm text-pink-600 hover:underline">
            Tümünü Gör
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Henüz siparişiniz yok.</p>
            <Link href="/urunler" className="text-pink-600 text-sm mt-2 inline-block hover:underline">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/hesabim/siparisler/${order.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div>
                  <p className="font-medium text-sm text-gray-800">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")} ·{" "}
                    {order.items.length} ürün
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${ORDER_STATUS_COLOR[order.status]}`}>
                    {ORDER_STATUS[order.status]}
                  </span>
                  <span className="font-bold text-gray-800 text-sm">
                    {formatPrice(order.total)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-pink-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
