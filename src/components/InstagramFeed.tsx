"use client";

import Script from "next/script";

// Setup: behold.so'ya ücretsiz üye ol, @butikkirtasiye_ hesabını bağla,
// widget ID'ni kopyalayıp .env dosyasına NEXT_PUBLIC_BEHOLD_FEED_ID=... olarak ekle.
const FEED_ID = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID;

export default function InstagramFeed() {
  if (!FEED_ID) {
    return <PlaceholderGrid />;
  }

  return (
    <>
      <Script src="https://w.behold.so/widget.js" strategy="afterInteractive" />
      <div dangerouslySetInnerHTML={{ __html: `<behold-widget feed-id="${FEED_ID}"></behold-widget>` }} />
    </>
  );
}

function PlaceholderGrid() {
  const colors = [
    "from-amber-50 to-orange-100",
    "from-yellow-50 to-amber-100",
    "from-orange-50 to-yellow-100",
    "from-amber-100 to-orange-50",
    "from-yellow-100 to-amber-50",
    "from-orange-100 to-yellow-50",
    "from-amber-50 to-yellow-100",
    "from-yellow-50 to-orange-50",
    "from-orange-50 to-amber-50",
  ];

  return (
    <div className="grid grid-cols-3 gap-1.5 md:gap-2">
      {colors.map((color, i) => (
        <div
          key={i}
          className={`aspect-square bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-8 h-8 text-[#F5A623]/40"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </div>
      ))}
    </div>
  );
}
