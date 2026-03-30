import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

const CATEGORY_EMOJIS: Record<string, string> = {
  "kalem-defter": "🖊️",
  "boya-sanat": "🎨",
  "okul-cantasi": "🎒",
  oyuncak: "🧸",
  ofis: "📎",
  kampanya: "🏷️",
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, active: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl">{CATEGORY_EMOJIS[slug] ?? "📦"}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} ürün</p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-gray-400">Bu kategoride henüz ürün yok.</p>
        </div>
      )}
    </div>
  );
}
