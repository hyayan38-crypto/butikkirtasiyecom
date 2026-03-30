import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, ORDER_STATUS, ORDER_STATUS_COLOR } from "@/lib/utils";
import { Package, ChevronRight, ArrowLeft } from "lucide-react";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  const userId = (session.user as { id: string }).id;
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } }, address: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/hesabim" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Siparişlerim</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">Henüz siparişiniz yok.</p>
          <Link href="/urunler" className="text-pink-600 text-sm mt-2 inline-block hover:underline">
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/hesabim/siparisler/${order.id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-pink-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-gray-900">{order.orderNumber}</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${ORDER_STATUS_COLOR[order.status]}`}>
                      {ORDER_STATUS[order.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric", month: "long", year: "numeric",
                    })} · {order.items.length} ürün
                  </p>
                  {order.address && (
                    <p className="text-sm text-gray-400 mt-1">
                      {order.address.district}, {order.address.city}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-pink-400 transition-colors" />
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="text-xs bg-gray-50 rounded-lg px-2 py-1 text-gray-600">
                    {item.product.name.length > 25
                      ? item.product.name.substring(0, 25) + "..."
                      : item.product.name}{" "}
                    x{item.quantity}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="text-xs bg-gray-50 rounded-lg px-2 py-1 text-gray-400">
                    +{order.items.length - 3} daha
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
