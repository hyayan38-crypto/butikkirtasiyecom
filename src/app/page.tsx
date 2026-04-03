"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ScanBarcode, RotateCcw } from "lucide-react";

type SearchResult =
  | { status: "loading" }
  | { status: "found"; name: string; price: number; stock: number; birim: string }
  | { status: "notfound" }
  | { status: "error"; message: string };

const RESET_DELAY = 8000;

export default function KioskPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const quaggaRef = useRef<typeof import("@ericblade/quagga2")["default"] | null>(null);
  const handledRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  const stopCamera = useCallback(() => {
    if (quaggaRef.current) {
      try { quaggaRef.current.stop(); } catch { /* ignore */ }
      quaggaRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopCamera();
    handledRef.current = false;
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setResult(null);
    setScanning(false);
  }, [stopCamera]);

  const handleBarcode = useCallback(
    async (barcode: string) => {
      if (handledRef.current) return;
      handledRef.current = true;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      stopCamera();
      setScanning(false);
      setResult({ status: "loading" });

      try {
        const res = await fetch(`/api/ekotek/${encodeURIComponent(barcode)}`);
        if (res.ok) {
          const data = await res.json();
          setResult({ status: "found", ...data });
        } else {
          setResult({ status: "notfound" });
        }
      } catch {
        setResult({ status: "error", message: "Bağlantı hatası" });
      }

      resetTimerRef.current = setTimeout(reset, RESET_DELAY);
    },
    [stopCamera, reset]
  );

  useEffect(() => {
    if (!scanning || !containerRef.current) return;

    handledRef.current = false;
    let stopped = false;

    import("@ericblade/quagga2").then(({ default: Quagga }) => {
      if (stopped || !containerRef.current) return;
      quaggaRef.current = Quagga;

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: containerRef.current,
            constraints: { facingMode: "environment", width: 1280, height: 720 },
          },
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "code_128_reader", "upc_reader"],
          },
          locate: true,
        },
        (err: unknown) => {
          if (err || stopped) {
            setResult({ status: "error", message: "Kamera açılamadı. Tarayıcı kamera iznini kontrol edin." });
            setScanning(false);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((r: { codeResult: { code: string | null } }) => {
        const code = r.codeResult.code;
        if (code) handleBarcode(code);
      });
    });

    return () => {
      stopped = true;
      if (quaggaRef.current) {
        try { quaggaRef.current.stop(); } catch { /* ignore */ }
        quaggaRef.current = null;
      }
    };
  }, [scanning, handleBarcode]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [stopCamera]);

  return (
    <div className="fixed inset-0 bg-[#1C1C1E] flex flex-col items-center overflow-y-auto">
      {/* Logo */}
      <div className="pt-8 pb-2 px-6 w-full max-w-sm">
        <Image
          src="/logo.jpg"
          alt="Butik Kırtasiye"
          width={400}
          height={100}
          className="w-full rounded-xl shadow-xl"
          priority
        />
      </div>

      {/* Başlık */}
      <div className="px-6 py-4 text-center">
        <h1 className="text-[#F5A623] text-lg font-bold leading-snug tracking-wide uppercase">
          Butik Kırtasiye Fiyat Gör
        </h1>
        <p className="text-white/50 text-sm mt-1">Hoşgeldiniz</p>
      </div>

      {/* İçerik */}
      <div className="flex-1 flex flex-col items-center justify-start w-full max-w-sm px-6 pb-10 gap-5">
        {/* Tarama butonu */}
        {!scanning && !result && (
          <button
            onClick={() => setScanning(true)}
            className="w-full bg-[#F5A623] text-[#1C1C1E] font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-base active:scale-95 transition-transform shadow-lg shadow-[#F5A623]/20"
          >
            <ScanBarcode className="w-6 h-6" />
            Barkod Okut
          </button>
        )}

        {/* Kamera */}
        {scanning && (
          <>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#F5A623]">
              <div
                ref={containerRef}
                className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_canvas]:hidden"
              />
              {/* Tarama çerçevesi */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-5 left-5 w-10 h-10 border-t-4 border-l-4 border-[#F5A623] rounded-tl-lg" />
                <div className="absolute top-5 right-5 w-10 h-10 border-t-4 border-r-4 border-[#F5A623] rounded-tr-lg" />
                <div className="absolute bottom-5 left-5 w-10 h-10 border-b-4 border-l-4 border-[#F5A623] rounded-bl-lg" />
                <div className="absolute bottom-5 right-5 w-10 h-10 border-b-4 border-r-4 border-[#F5A623] rounded-br-lg" />
                {/* Tarama çizgisi animasyonu */}
                <div className="absolute left-6 right-6 h-0.5 bg-[#F5A623]/70 animate-scan top-1/2" />
              </div>
              <p className="absolute bottom-3 left-0 right-0 text-center text-white/60 text-xs">
                Barkodu çerçeve içine alın — yaklaşık 15–20 cm uzakta tutun
              </p>
            </div>
            <button
              onClick={reset}
              className="text-white/40 text-sm hover:text-white/60 transition-colors"
            >
              İptal
            </button>
          </>
        )}

        {/* Yükleniyor */}
        {result?.status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-12 h-12 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50">Aranıyor...</p>
          </div>
        )}

        {/* Ürün bulundu */}
        {result?.status === "found" && (
          <div className="w-full bg-[#2C2C2E] rounded-2xl p-6 flex flex-col gap-3">
            <p className="text-[#F5A623] text-xs uppercase tracking-widest font-semibold">
              Ürün Fiyatı
            </p>
            <p className="text-white text-lg font-semibold leading-snug">
              {result.name}
            </p>
            <p className="text-[#F5A623] text-5xl font-bold">
              {result.price.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-3xl">₺</span>
            </p>
            <p className="text-white/40 text-sm">
              Stok:{" "}
              {result.stock > 0
                ? `${result.stock} ${result.birim}`
                : "Tükendi"}
            </p>
          </div>
        )}

        {/* Bulunamadı */}
        {result?.status === "notfound" && (
          <div className="w-full bg-red-950/50 border border-red-800/60 rounded-2xl p-6 text-center">
            <p className="text-red-400 text-4xl mb-3">✗</p>
            <p className="text-white font-semibold text-lg">Ürün bulunamadı</p>
            <p className="text-white/40 text-sm mt-1">
              Bu barkod sistemde kayıtlı değil
            </p>
          </div>
        )}

        {/* Hata */}
        {result?.status === "error" && (
          <div className="w-full bg-yellow-950/50 border border-yellow-800/60 rounded-2xl p-6 text-center">
            <p className="text-yellow-400 font-semibold">{result.message}</p>
          </div>
        )}

        {/* Yeni tarama butonu */}
        {result !== null && result.status !== "loading" && (
          <button
            onClick={() => setScanning(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#F5A623] text-[#1C1C1E] font-bold py-3.5 rounded-2xl active:scale-95 transition-transform"
          >
            <RotateCcw className="w-5 h-5" />
            Yeni Tarama
          </button>
        )}
      </div>
    </div>
  );
}
