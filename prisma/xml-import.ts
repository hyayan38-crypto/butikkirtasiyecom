// XML'den ürün aktarma scripti
// Kullanım: npx tsx prisma/xml-import.ts
// Seçenekler:
//   LIMIT=500 npx tsx prisma/xml-import.ts   (kaç ürün aktarılsın, varsayılan: 500)
//   MARKUP=1.4 npx tsx prisma/xml-import.ts  (kar marjı çarpanı: 1.4 = %40 kar, varsayılan: 1.35)

import { XMLParser } from "fast-xml-parser";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();
const LIMIT = parseInt(process.env.LIMIT || "500");
const MARKUP = parseFloat(process.env.MARKUP || "1.35"); // %35 kar marjı

interface XmlUrun {
  ID: number;
  NAME: string;
  RESIM1: string;
  FIYAT: string;
  STOK: number;
  UST_KAT: string;
  MARKA: string;
}

function parsePrice(priceStr: string): number {
  return parseFloat(String(priceStr).replace(",", "."));
}

function makeSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, locale: "tr" });
}

async function main() {
  console.log("XML indiriliyor (17MB, biraz sürebilir)...");
  const res = await fetch("https://www.kirtasiyem.com.tr/content/xml/urunler.xml");
  const xml = await res.text();

  const parser = new XMLParser({ ignoreAttributes: false });
  const data = parser.parse(xml);
  const tumUrunler: XmlUrun[] = data.urunler.Urun;

  console.log(`Toplam ${tumUrunler.length} ürün bulundu. İlk ${LIMIT} adet aktarılacak.`);
  console.log(`Fiyat çarpanı: x${MARKUP} (tedarikçi fiyatı × ${MARKUP})`);

  // Benzersiz kategorileri çıkar
  const kategoriler = [...new Set(tumUrunler.map((p) => p.UST_KAT))].filter(Boolean);
  console.log(`\n${kategoriler.length} kategori oluşturuluyor...`);

  const categoryMap: Record<string, string> = {};
  for (const katAdi of kategoriler) {
    const slug = makeSlug(katAdi);
    const cat = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name: katAdi, slug },
    });
    categoryMap[katAdi] = cat.id;
  }
  console.log("Kategoriler hazır.");

  // Mevcut slug'ları yükle (çakışma önleme)
  const mevcutSluglar = new Set(
    (await prisma.product.findMany({ select: { slug: true } })).map((p) => p.slug)
  );

  // Ürünleri aktar
  let aktarilan = 0;
  let atlanan = 0;
  const aktarilacaklar = tumUrunler.slice(0, LIMIT);

  console.log(`\nÜrünler aktarılıyor...`);

  for (const p of aktarilacaklar) {
    const hamFiyat = parsePrice(String(p.FIYAT));
    if (isNaN(hamFiyat) || hamFiyat <= 0) { atlanan++; continue; }

    const satisFiyat = Math.round(hamFiyat * MARKUP * 100) / 100;
    const categoryId = categoryMap[p.UST_KAT];
    if (!categoryId) { atlanan++; continue; }

    let slug = makeSlug(String(p.NAME));
    if (!slug) { atlanan++; continue; }

    // Slug çakışması varsa numara ekle
    let finalSlug = slug;
    let sayac = 1;
    while (mevcutSluglar.has(finalSlug)) {
      finalSlug = `${slug}-${sayac++}`;
    }
    mevcutSluglar.add(finalSlug);

    try {
      await prisma.product.create({
        data: {
          name: String(p.NAME),
          slug: finalSlug,
          description: `Marka: ${p.MARKA}`,
          price: satisFiyat,
          stock: Number(p.STOK) || 0,
          images: JSON.stringify([String(p.RESIM1)]),
          active: true,
          featured: false,
          categoryId,
        },
      });
      aktarilan++;
      if (aktarilan % 50 === 0) {
        console.log(`  ${aktarilan}/${LIMIT} ürün aktarıldı...`);
      }
    } catch {
      atlanan++;
    }
  }

  console.log(`\n✅ Tamamlandı!`);
  console.log(`   Aktarılan: ${aktarilan} ürün`);
  console.log(`   Atlanan:   ${atlanan} ürün`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
