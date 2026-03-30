import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, getProductImages, ORDER_STATUS, ORDER_STATUS_COLOR } from "@/lib/utils";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  const userId = (session.user as { id: string }).id;
  const { id } = await params;
  const { success } = await searchParams;

  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: {
      items: { include: { product: { include: { category: true } } } },
      address: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-green-500 shrink-0" />
          <div>
            <p className="font-bold text-green-800">Siparişiniz Alındı!</p>
            <p className="text-sm text-green-600 mt-0.5">
              Siparişiniz hazırlanmaya başladı. Kargo takibini bu sayfadan yapabilirsiniz.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/hesabim/siparisler" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-sm text-gray-400">
            {new Date(order.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`ml-auto text-xs font-medium px-3 py-1.5 rounded-full ${ORDER_STATUS_COLOR[order.status]}`}>
          {ORDER_STATUS[order.status]}
        </span>
      </div>

      <div className="space-y-4">
        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Ürünler</h2>
          <div className="space-y-3">
            {order.items.map((item) => {
              const images = getProductImages(item.product.images);
              return (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                    <Image src={images[0]} alt={item.product.name} fill className="object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/urun/${item.product.slug}`} className="text-sm font-medium text-gray-800 hover:text-pink-600 line-clamp-1">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-400">{item.product.category.name} · x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-800 shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Sipariş Özeti</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Ara Toplam</span>
              <span>{formatPrice(order.total - order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Kargo</span>
              <span className={order.shippingCost === 0 ? "text-green-600" : ""}>
                {order.shippingCost === 0 ? "Ücretsiz" : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Toplam</span>
              <span className="text-pink-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        {order.address && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-3">Teslimat Adresi</h2>
            <p className="text-sm text-gray-700 font-medium">{order.address.name}</p>
            <p className="text-sm text-gray-500">{order.address.phone}</p>
            <p className="text-sm text-gray-500 mt-1">
              {order.address.address}, {order.address.district}/{order.address.city}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
