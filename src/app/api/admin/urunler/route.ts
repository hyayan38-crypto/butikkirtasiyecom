import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  return session && role === "admin";
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const body = await req.json();
  const { name, slug, description, price, salePrice, stock, categoryId, images, featured } = body;

  if (!name || !slug || !price || !categoryId) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Bu slug zaten kullanımda." }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      price,
      salePrice: salePrice || null,
      stock,
      categoryId,
      images: images || "[]",
      featured: featured ?? false,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
