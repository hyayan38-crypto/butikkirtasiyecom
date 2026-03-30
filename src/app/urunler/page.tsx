import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Filter } from "lucide-react";

interface SearchParams {
  q?: string;
  kategori?: string;
  siralama?: string;
  sayfa?: string;
}

const PAGE_SIZE = 12;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number(params.sayfa ?? 1);
  const query = params.q ?? "";
  const kategoriSlug = params.kategori ?? "";
  const siralama = params.siralama ?? "yeni";

  const where: Record<string, unknown> = { active: true };
  if (query) where.name = { contains: query };
  if (kategoriSlug) {
    where.category = { slug: kategoriSlug };
  }

  const orderBy =
    siralama === "ucuz"
      ? { price: "asc" as const }
      : siralama === "pahali"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {query ? `"${query}" için sonuçlar` : "Tüm Ürünler"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{total} ürün bulundu</p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            defaultValue={siralama}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set("siralama", e.target.value);
              window.location.href = url.toString();
            }}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="yeni">En Yeni</option>
            <option value="ucuz">En Ucuz</option>
            <option value="pahali">En Pahalı</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Kategori</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/urunler"
                  className={`block px-2 py-1.5 rounded-lg text-sm transition-colors ${
                    !kategoriSlug
                      ? "bg-pink-50 text-pink-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Tümü
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/urunler?kategori=${cat.slug}`}
                    className={`block px-2 py-1.5 rounded-lg text-sm transition-colors ${
                      kategoriSlug === cat.slug
                        ? "bg-pink-50 text-pink-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/urunler?sayfa=${p}${query ? `&q=${query}` : ""}${kategoriSlug ? `&kategori=${kategoriSlug}` : ""}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-pink-600 text-white"
                          : "bg-white border text-gray-600 hover:border-pink-300"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-400">Ürün bulunamadı.</p>
              <Link href="/urunler" className="text-pink-600 text-sm mt-2 inline-block hover:underline">
                Tüm ürünlere dön
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
