"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ScanBarcode, X, RotateCcw } from "lucide-react";

type SearchResult =
  | { status: "loading" }
  | { status: "found"; name: string; price: number; stock: number; birim: string }
  | { status: "notfound" }
  | { status: "error"; message: string };

const RESET_DELAY = 7000;

export default function FiyatGorSection() {
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

  const close = useCallback(() => {
    stopCamera();
    handledRef.current = false;
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setScanning(false);
    setResult(null);
  }, [stopCamera]);

  const newScan = useCallback(() => {
    stopCamera();
    handledRef.current = false;
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setResult(null);
    setScanning(true);
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

      resetTimerRef.current = setTimeout(() => {
        setResult(null);
        setScanning(false);
      }, RESET_DELAY);
    },
    [stopCamera]
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

  const isOpen = scanning || result !== null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden">
        {!isOpen ? (
          /* Kapalı hali */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#F5A623]/10 p-3.5 rounded-2xl shrink-0">
                <ScanBarcode className="w-8 h-8 text-[#F5A623]" />
              </div>
              <div>
                <h2 className="text-white text-lg font-bold leading-tight">
                  Fiyat Öğren
                </h2>
                <p className="text-white/40 text-sm mt-0.5">
                  Ürün barkodunu okutarak fiyatını öğrenin
                </p>
              </div>
            </div>
            <button
              onClick={newScan}
              className="shrink-0 bg-[#F5A623] text-[#1C1C1E] font-bold px-7 py-3 rounded-xl hover:bg-[#e09520] active:scale-95 transition-all flex items-center gap-2 text-sm"
            >
              <ScanBarcode className="w-4 h-4" />
              Barkod Okut
            </button>
          </div>
        ) : (
          /* Açık hali */
          <div className="flex flex-col items-center py-6 px-6 gap-5">
            {/* Başlık + kapat */}
            <div className="flex items-center justify-between w-full max-w-sm">
              <h2 className="text-white font-bold text-base">Fiyat Öğren</h2>
              <button
                onClick={close}
                className="text-white/40 hover:text-white/70 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Kamera görünümü */}
            {scanning && (
              <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#F5A623]">
                <div
                  ref={containerRef}
                  className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_canvas]:hidden"
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#F5A623] rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#F5A623] rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#F5A623] rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#F5A623] rounded-br-lg" />
                  <p className="absolute bottom-2.5 left-0 right-0 text-center text-white/50 text-xs">
                    Barkodu çerçeve içine alın
                  </p>
                </div>
              </div>
            )}

            {/* Yükleniyor */}
            {result?.status === "loading" && (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
                <p className="text-white/50 text-sm">Aranıyor...</p>
              </div>
            )}

            {/* Ürün bulundu */}
            {result?.status === "found" && (
              <div className="w-full max-w-sm bg-[#2C2C2E] rounded-2xl p-5 flex flex-col gap-2">
                <p className="text-white/60 text-xs uppercase tracking-widest font-medium">
                  Ürün Fiyatı
                </p>
                <p className="text-white text-base font-semibold leading-snug">
                  {result.name}
                </p>
                <p className="text-[#F5A623] text-4xl font-bold mt-1">
                  {result.price.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ₺
                </p>
                <p className="text-white/40 text-sm">
                  Stok:{" "}
                  {result.stock > 0
                    ? `${result.stock} ${result.birim}`
                    : "Tükendi"}
                </p>
              </div>
            )}

            {/* Ürün bulunamadı */}
            {result?.status === "notfound" && (
              <div className="w-full max-w-sm bg-red-950/50 border border-red-800/60 rounded-2xl p-5 text-center">
                <p className="text-red-400 text-3xl mb-2">✗</p>
                <p className="text-white font-medium">Ürün bulunamadı</p>
                <p className="text-white/40 text-sm mt-1">
                  Bu barkod sistemde kayıtlı değil
                </p>
              </div>
            )}

            {/* Hata */}
            {result?.status === "error" && (
              <div className="w-full max-w-sm bg-yellow-950/50 border border-yellow-800/60 rounded-2xl p-5 text-center">
                <p className="text-yellow-400 font-medium">{result.message}</p>
              </div>
            )}

            {/* Yeni tarama butonu */}
            {result !== null && result.status !== "loading" && (
              <button
                onClick={newScan}
                className="flex items-center gap-2 bg-[#F5A623] text-[#1C1C1E] font-semibold px-6 py-2.5 rounded-full text-sm active:scale-95 transition-transform"
              >
                <RotateCcw className="w-4 h-4" />
                Yeni Tarama
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
