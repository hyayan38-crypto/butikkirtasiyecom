import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Temizleniyor...");

  const urunler = await prisma.product.deleteMany({});
  console.log(`${urunler.count} ürün silindi.`);

  const kategoriler = await prisma.category.deleteMany({});
  console.log(`${kategoriler.count} kategori silindi.`);

  console.log("Tamamlandı.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
