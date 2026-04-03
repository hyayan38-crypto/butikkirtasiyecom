// XML yapısını kontrol etmek için - bir kez çalıştır
import { XMLParser } from "fast-xml-parser";

async function kontrol() {
  console.log("XML indiriliyor...");
  const res = await fetch("https://www.kirtasiyem.com.tr/content/xml/urunler.xml");
  const xml = await res.text();

  console.log("XML boyutu:", (xml.length / 1024 / 1024).toFixed(2), "MB");

  const parser = new XMLParser({ ignoreAttributes: false });
  const data = parser.parse(xml);

  // Kök anahtarları göster
  console.log("\nKök anahtarlar:", Object.keys(data));

  // İlk seviye
  const root = data[Object.keys(data)[0]];
  console.log("İkinci seviye anahtarlar:", Object.keys(root));

  // İlk ürünü bul
  let products: Record<string, unknown>[] = [];
  for (const key of Object.keys(root)) {
    if (Array.isArray(root[key])) {
      products = root[key] as Record<string, unknown>[];
      console.log(`\nDizi bulundu: "${key}", ${products.length} kayıt`);
      break;
    }
  }

  if (products.length > 0) {
    console.log("\nİlk ürün alanları:");
    console.log(JSON.stringify(products[0], null, 2));
    console.log("\nİkinci ürün:");
    console.log(JSON.stringify(products[1], null, 2));
  }
}

kontrol().catch(console.error);
