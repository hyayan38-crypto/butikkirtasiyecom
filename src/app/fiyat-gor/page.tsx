"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";

type ProductResult = {
  name: string;
  price: number;
  salePrice: number | null;
  stock: number;
  image: string | null;
  category: string;
};

type State =
  | { status: "scanning" }
  | { status: "loading" }
  | { status: "found"; product: ProductResult }
  | { status: "notfound" }
  | { status: "error"; message: string };

const RESET_DELAY = 5000; // ms

export default function FiyatGorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<State>({ status: "scanning" });

  const resetToScanning = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setState({ status: "scanning" });
  }, []);

  const handleBarcode = useCallback(
    async (barcode: string) => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      setState({ status: "loading" });

      try {
        const res = await fetch(`/api/fiyat/${encodeURIComponent(barcode)}`);
        if (res.ok) {
          const product: ProductResult = await res.json();
          setState({ status: "found", product });
        } else {
          setState({ status: "notfound" });
        }
      } catch {
        setState({ status: "error", message: "Bağlantı hatası" });
      }

      resetTimerRef.current = setTimeout(resetToScanning, RESET_DELAY);
    },
    [resetToScanning]
  );

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;
    let stopped = false;

    (async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const backCamera =
          devices.find((d) => /back|rear|environment/i.test(d.label)) ??
          devices[devices.length - 1];
        const deviceId = backCamera?.deviceId;

        if (!videoRef.current) return;

        await reader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, err) => {
            if (stopped) return;
            if (result) {
              const text = result.getText();
              setState((prev) => {
                if (prev.status === "scanning") {
                  handleBarcode(text);
                }
                return prev;
              });
            } else if (err && !(err instanceof NotFoundException)) {
              console.warn("Barkod okuma hatası:", err);
            }
          }
        );
      } catch (e) {
        console.error(e);
        setState({ status: "error", message: "Kamera açılamadı. İzin verildiğinden emin olun." });
      }
    })();

    return () => {
      stopped = true;
      BrowserMultiFormatReader.releaseAllStreams();
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [handleBarcode]);

  const displayPrice = (product: ProductResult) =>
    product.salePrice ?? product.price;

  return (
    <div className="fixed inset-0 bg-[#1C1C1E] flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Logo */}
      <div className="pt-8 pb-4">
        <Image
          src="/logo.jpg"
          alt="Butiik Kırtasiye"
          width={140}
          height={60}
          className="rounded-lg object-contain"
          priority
        />
      </div>

      {/* Ana içerik */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 gap-8">
        {/* Kamera */}
        <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-2 border-[#F5A623]">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
          {/* Tarama çerçevesi */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-[#F5A623] rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-[#F5A623] rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-[#F5A623] rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-[#F5A623] rounded-br-lg" />
          </div>
        </div>

        {/* Sonuç alanı */}
        <div className="w-full max-w-sm min-h-[160px] flex items-center justify-center">
          {state.status === "scanning" && (
            <p className="text-white/50 text-lg text-center">
              Barkodu kameraya tutun
            </p>
          )}

          {state.status === "loading" && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
              <p className="text-white/50 text-base">Aranıyor...</p>
            </div>
          )}

          {state.status === "found" && (
            <div className="w-full bg-[#2C2C2E] rounded-2xl p-6 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {state.product.image && (
                <Image
                  src={state.product.image}
                  alt={state.product.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-contain self-center bg-white p-1"
                  unoptimized
                />
              )}
              <p className="text-[#F5A623] text-xs uppercase tracking-widest font-medium">
                {state.product.category}
              </p>
              <p className="text-white text-xl font-semibold leading-tight">
                {state.product.name}
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-[#F5A623] text-4xl font-bold">
                  {displayPrice(state.product).toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ₺
                </span>
                {state.product.salePrice && (
                  <span className="text-white/40 text-xl line-through">
                    {state.product.price.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    ₺
                  </span>
                )}
              </div>
              <p className="text-white/40 text-sm">
                Stok: {state.product.stock > 0 ? `${state.product.stock} adet` : "Tükendi"}
              </p>
            </div>
          )}

          {state.status === "notfound" && (
            <div className="w-full bg-red-950/50 border border-red-800 rounded-2xl p-6 text-center animate-in fade-in duration-300">
              <p className="text-red-400 text-5xl mb-3">✗</p>
              <p className="text-white text-lg font-medium">Ürün bulunamadı</p>
              <p className="text-white/40 text-sm mt-1">Bu barkod sistemde kayıtlı değil</p>
            </div>
          )}

          {state.status === "error" && (
            <div className="w-full bg-yellow-950/50 border border-yellow-800 rounded-2xl p-6 text-center">
              <p className="text-yellow-400 text-lg font-medium">{state.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Alt bilgi */}
      <div className="pb-8 flex flex-col items-center gap-3">
        {(state.status === "found" || state.status === "notfound") && (
          <button
            onClick={resetToScanning}
            className="bg-[#F5A623] text-[#1C1C1E] font-semibold px-6 py-2 rounded-full text-sm active:scale-95 transition-transform"
          >
            Yeni Tarama
          </button>
        )}
        <p className="text-white/20 text-xs">butikkirtasiye.com</p>
      </div>
    </div>
  );
}
