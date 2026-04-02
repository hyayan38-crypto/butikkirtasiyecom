import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { items, address, paymentMethod, notes } = await req.json();

  if (!items?.length || !address) {
    return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
  }

  // Verify products and calculate total
  const productIds = items.map((i: { id: string }) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  let subtotal = 0;
  const orderItems: { productId: string; quantity: number; price: number }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.id);
    if (!product || product.stock < item.quantity) {
      return NextResponse.json(
        { error: `${item.name} için yeterli stok yok` },
        { status: 400 }
      );
    }
    const price = product.salePrice ?? product.price;
    subtotal += price * item.quantity;
    orderItems.push({ productId: product.id, quantity: item.quantity, price });
  }

  const shippingCost = subtotal >= 500 ? 0 : 49.9;
  const total = subtotal + shippingCost;
  const orderNumber = generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId,
        total,
        shippingCost,
        paymentMethod: paymentMethod ?? "card",
        notes: notes ?? null,
        items: {
          create: orderItems,
        },
        address: {
          create: {
            name: address.name,
            phone: address.phone,
            city: address.city,
            district: address.district,
            address: address.address,
          },
        },
      },
    });

    // Reduce stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber }, { status: 201 });
}
