import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed başlıyor...");

  // Admin kullanıcı
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@butikkirtasiye.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@butikkirtasiye.com",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("Admin oluşturuldu:", admin.email);

  // Kategoriler
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "kalem-defter" }, update: {}, create: { name: "Kalem & Defter", slug: "kalem-defter" } }),
    prisma.category.upsert({ where: { slug: "boya-sanat" }, update: {}, create: { name: "Boya & Sanat", slug: "boya-sanat" } }),
    prisma.category.upsert({ where: { slug: "okul-cantasi" }, update: {}, create: { name: "Okul Çantası", slug: "okul-cantasi" } }),
    prisma.category.upsert({ where: { slug: "oyuncak" }, update: {}, create: { name: "Oyuncak", slug: "oyuncak" } }),
    prisma.category.upsert({ where: { slug: "ofis" }, update: {}, create: { name: "Ofis", slug: "ofis" } }),
    prisma.category.upsert({ where: { slug: "kampanya" }, update: {}, create: { name: "Kampanya", slug: "kampanya" } }),
  ]);
  console.log("Kategoriler oluşturuldu:", categories.length);

  // Örnek ürünler
  const kalemDefter = categories[0];
  const boyaSanat = categories[1];
  const oyuncak = categories[3];

  const sampleProducts = [
    {
      name: "Staedtler Triplus Fineliner 20'li Set",
      slug: "staedtler-triplus-fineliner-20li-set",
      description: "20 farklı renk, 0.3mm uç kalınlığı. Okul ve ofis kullanımı için ideal.",
      price: 185.0,
      salePrice: 149.9,
      stock: 50,
      categoryId: kalemDefter.id,
      featured: true,
      images: JSON.stringify(["https://via.placeholder.com/400x400/FFE4E1/FF69B4?text=Fineliner+Set"]),
    },
    {
      name: "Moleskine Cahier Defter A5",
      slug: "moleskine-cahier-defter-a5",
      description: "A5 boyut, çizgili, 80 sayfa. Yumuşak kapak.",
      price: 220.0,
      stock: 30,
      categoryId: kalemDefter.id,
      featured: true,
      images: JSON.stringify(["https://via.placeholder.com/400x400/E8F5E9/4CAF50?text=Moleskine+A5"]),
    },
    {
      name: "Faber-Castell 48'li Kuru Boya Seti",
      slug: "faber-castell-48li-kuru-boya-seti",
      description: "48 canlı renk, triangular gövde. Kolay kavrama, kırılmaz uç.",
      price: 299.0,
      salePrice: 249.0,
      stock: 25,
      categoryId: boyaSanat.id,
      featured: true,
      images: JSON.stringify(["https://via.placeholder.com/400x400/FFF3E0/FF9800?text=Faber+Castell"]),
    },
    {
      name: "LEGO Classic 11002 Temel Parça Seti",
      slug: "lego-classic-11002-temel-parca-seti",
      description: "300+ parça, 6+ yaş. Yaratıcılığı geliştiren klasik LEGO seti.",
      price: 650.0,
      salePrice: 549.0,
      stock: 15,
      categoryId: oyuncak.id,
      featured: true,
      images: JSON.stringify(["https://via.placeholder.com/400x400/E3F2FD/2196F3?text=LEGO+Classic"]),
    },
    {
      name: "Pilot G2 Jel Kalem 0.7 mm",
      slug: "pilot-g2-jel-kalem-07mm",
      description: "Akıcı jel mürekkep, ergonomik kavrama. Siyah mürekkep.",
      price: 45.0,
      stock: 100,
      categoryId: kalemDefter.id,
      featured: false,
      images: JSON.stringify(["https://via.placeholder.com/400x400/F3E5F5/9C27B0?text=Pilot+G2"]),
    },
    {
      name: "Oyun Hamuru 8'li Set",
      slug: "oyun-hamuru-8li-set",
      description: "8 farklı renk, toksik olmayan malzeme. 3+ yaş için güvenli.",
      price: 120.0,
      salePrice: 89.9,
      stock: 40,
      categoryId: oyuncak.id,
      featured: false,
      images: JSON.stringify(["https://via.placeholder.com/400x400/FCE4EC/E91E63?text=Oyun+Hamuru"]),
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log("Örnek ürünler oluşturuldu:", sampleProducts.length);

  console.log("\nSeed tamamlandı!");
  console.log("Admin giriş: admin@butikkirtasiye.com / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
