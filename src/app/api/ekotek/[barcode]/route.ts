import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  try {
    const res = await fetch(
      `https://ekotek.duckdns.org:3443/api/urun?q=${encodeURIComponent(barcode)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Servis hatası" }, { status: 502 });
    }

    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.items ?? data?.urunler ?? [];

    if (list.length === 0) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // Tam barkod eşleşmesini tercih et, yoksa ilk sonucu al
    const item =
      list.find(
        (p: Record<string, unknown>) =>
          p.barcode === barcode || p.barkod === barcode || p.BARKOD === barcode
      ) ?? list[0];

    const name =
      item.URUNADI ?? item.name ?? item.ad ?? item.NAME ?? item.urunAdi ?? item.urun_adi ?? "";
    const price =
      item.SATIS_FIYATI ?? item.fiyat ?? item.price ?? item.FIYAT ?? item.satisFiyati ?? 0;
    const stock =
      item.stok ?? item.stock ?? item.STOK ?? item.miktar ?? 0;
    const birim =
      item.birim ?? item.BIRIM ?? item.unit ?? "adet";

    if (!name) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      name: String(name),
      price: typeof price === "string" ? parseFloat(price.replace(",", ".")) : Number(price),
      stock: Number(stock),
      birim: String(birim),
    });
  } catch {
    return NextResponse.json({ error: "Bağlantı hatası" }, { status: 503 });
  }
}
