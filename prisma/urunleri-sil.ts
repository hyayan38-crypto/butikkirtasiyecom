import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
prisma.product.deleteMany().then(r => {
  console.log("Silindi:", r.count, "ürün");
  return prisma.$disconnect();
});
