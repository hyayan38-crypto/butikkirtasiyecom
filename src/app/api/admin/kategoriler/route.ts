import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "admin") return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const { name, slug } = await req.json();
  if (!name || !slug) return NextResponse.json({ error: "Ad ve slug gerekli." }, { status: 400 });

  const category = await prisma.category.create({ data: { name, slug } });
  return NextResponse.json(category, { status: 201 });
}
