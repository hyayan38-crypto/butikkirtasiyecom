export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(price);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK-${timestamp}-${random}`;
}

export function getProductImages(imagesJson: string): string[] {
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : ["/placeholder-product.png"];
  } catch {
    return ["/placeholder-product.png"];
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const ORDER_STATUS: Record<string, string> = {
  pending: "Beklemede",
  processing: "Hazırlanıyor",
  shipped: "Kargoya Verildi",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};
