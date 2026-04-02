import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  if (!barcode) {
    return NextResponse.json({ error: "Barkod gerekli" }, { status: 400 });
  }

  const product = await prisma.product.findFirst({
    where: { barcode, active: true },
    select: {
      name: true,
      price: true,
      salePrice: true,
      stock: true,
      images: true,
      category: { select: { name: true } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({
    name: product.name,
    price: product.price,
    salePrice: product.salePrice,
    stock: product.stock,
    image: JSON.parse(product.images)[0] ?? null,
    category: product.category.name,
  });
}
