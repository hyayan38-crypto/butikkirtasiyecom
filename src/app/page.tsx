"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import { ScanBarcode, RotateCcw } from "lucide-react";

type SearchResult =
  | { status: "loading" }
  | { status: "found"; name: string; price: number; stock: number; birim: string }
  | { status: "notfound" }
  | { status: "error"; message: string };

const RESET_DELAY = 8000;

export default function KioskPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  const stopCamera = useCallback(() => {
    BrowserMultiFormatReader.releaseAllStreams();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopCamera();
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setResult(null);
    setScanning(false);
  }, [stopCamera]);

  const handleBarcode = useCallback(
    async (barcode: string) => {
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
    if (!scanning) return;

    let handled = false;
    const reader = new BrowserMultiFormatReader();

    (async () => {
      try {
        // Otofokuslu arka kamera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet],
          },
        });

        streamRef.current = stream;
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        await reader.decodeFromStream(stream, videoRef.current, (r, err) => {
          if (handled) return;
          if (r) {
            handled = true;
            handleBarcode(r.getText());
          } else if (err && !(err instanceof NotFoundException)) {
            console.warn(err);
          }
        });
      } catch {
        setResult({
          status: "error",
          message: "Kamera açılamadı. Tarayıcı kamera iznini kontrol edin.",
        });
        setScanning(false);
      }
    })();

    return () => {
      handled = true;
      BrowserMultiFormatReader.releaseAllStreams();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
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
        <p className="text-white/50 text-sm mt-1">Programına Hoşgeldiniz</p>
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
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
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
