import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1E] text-gray-500 text-xs">
      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Butik Kırtasiye</p>
        <div className="flex items-center gap-4">
          <Link href="/giris" className="hover:text-[#F5A623] transition-colors">
            Yönetim
          </Link>
        </div>
      </div>
    </footer>
  );
}
