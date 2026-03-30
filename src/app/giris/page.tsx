"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"giris" | "kayit">("giris");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email: loginForm.email,
      password: loginForm.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("E-posta veya şifre hatalı.");
    } else {
      router.push("/hesabim");
      router.refresh();
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/kayit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Bir hata oluştu.");
      setLoading(false);
      return;
    }
    await signIn("credentials", {
      email: registerForm.email,
      password: registerForm.password,
      redirect: false,
    });
    setLoading(false);
    router.push("/hesabim");
    router.refresh();
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-pink-600" />
            <span className="font-bold text-2xl text-gray-800">
              Butiik <span className="text-pink-600">Kırtasiye</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-50 rounded-xl p-1">
            {(["giris", "kayit"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t
                    ? "bg-white text-pink-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "giris" ? "Giriş Yap" : "Üye Ol"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {tab === "giris" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 text-white py-2.5 rounded-xl font-semibold hover:bg-pink-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Ad Soyad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={registerForm.phone}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, phone: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="05XX XXX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={6}
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 pr-10"
                    placeholder="En az 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 text-white py-2.5 rounded-xl font-semibold hover:bg-pink-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Kayıt yapılıyor..." : "Üye Ol"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
