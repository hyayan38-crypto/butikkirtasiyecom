import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#F5A623]">
      <div className="max-w-lg mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.jpg"
            alt="Butik Kırtasiye"
            width={80}
            height={32}
            className="h-8 w-auto rounded-lg"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
