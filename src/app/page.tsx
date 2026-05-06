import Image from "next/image";
import { ChevronRight } from "lucide-react";

/* ─── İkonlar ─── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 md:w-10 md:h-10">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" />
  </svg>
);

const MapsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 md:w-10 md:h-10">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ─── İletişim kartları ─── */
const contacts = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    cta: "Hemen Yaz",
    desc: "Mesajınıza hızla dönüyoruz",
    href: "https://wa.me/905446584450",
    cardBg: "bg-[#25D366]",
    iconBg: "bg-white/20",
    textClass: "text-white",
    subTextClass: "text-white/75",
    arrowClass: "text-white/60",
    icon: <WhatsAppIcon />,
    external: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    cta: "Bizi Takip Et",
    desc: "@butikkirtasiye_",
    href: "https://www.instagram.com/butikkirtasiye_",
    cardBg: "bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737]",
    iconBg: "bg-white/20",
    textClass: "text-white",
    subTextClass: "text-white/75",
    arrowClass: "text-white/60",
    icon: <InstagramIcon />,
    external: true,
  },
  {
    id: "phone",
    label: "Telefon",
    cta: "Hemen Ara",
    desc: "0544 658 44 50",
    href: "tel:+905446584450",
    cardBg: "bg-[#1C1C1E]",
    iconBg: "bg-[#F5A623]/15",
    textClass: "text-white",
    subTextClass: "text-gray-400",
    arrowClass: "text-gray-600",
    icon: <span className="text-[#F5A623]"><PhoneIcon /></span>,
    external: false,
  },
  {
    id: "maps",
    label: "Google Maps",
    cta: "Yol Tarifi Al",
    desc: "Mağazamıza kolayca ulaşın",
    href: "https://share.google/Q1JSoYGkCOsLFF35b",
    cardBg: "bg-white border border-gray-200",
    iconBg: "bg-[#4285F4]/10",
    textClass: "text-gray-800",
    subTextClass: "text-gray-500",
    arrowClass: "text-gray-300",
    icon: <span className="text-[#4285F4]"><MapsIcon /></span>,
    external: true,
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0]">

      {/* ─── MARKA BAŞLIĞI ─── */}
      <section className="bg-white border-b border-gray-100 py-10 px-4">
        <div className="max-w-lg mx-auto flex flex-col items-center text-center gap-4">
          <Image
            src="/logo.jpg"
            alt="Butik Kırtasiye"
            width={900}
            height={300}
            quality={95}
            className="w-full max-w-xs h-auto rounded-xl object-contain shadow-md"
            priority
          />
          <p className="text-gray-500 text-sm leading-relaxed">
            Kırtasiye · Boya &amp; Sanat · Oyuncak · Okul Malzemeleri
          </p>
        </div>
      </section>

      {/* ─── İLETİŞİM KARTLARI ─── */}
      <section className="max-w-lg mx-auto px-4 py-8">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-5">
          Bize Ulaşın
        </p>

        <div className="flex flex-col gap-3.5">
          {contacts.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className={`
                flex items-center gap-4 px-5 py-5 rounded-2xl shadow-sm
                active:scale-[0.98] transition-all duration-150
                ${c.cardBg}
              `}
            >
              {/* İkon alanı */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
                {c.icon}
              </div>

              {/* Yazı */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${c.subTextClass}`}>
                  {c.label}
                </p>
                <p className={`text-xl font-extrabold leading-tight ${c.textClass}`}>
                  {c.cta}
                </p>
                <p className={`text-sm mt-0.5 truncate ${c.subTextClass}`}>
                  {c.desc}
                </p>
              </div>

              {/* Ok */}
              <ChevronRight className={`w-5 h-5 shrink-0 ${c.arrowClass}`} />
            </a>
          ))}
        </div>
      </section>

      {/* ─── ÇALIŞMA SAATLERİ ─── */}
      <section className="max-w-lg mx-auto px-4 pb-6">
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Çalışma Saatleri</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pazartesi – Cuma</span>
              <span className="font-semibold text-gray-800">08:00 – 20:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cumartesi – Pazar</span>
              <span className="font-semibold text-gray-800">09:00 – 20:00</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
