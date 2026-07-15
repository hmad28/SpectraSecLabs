"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login gagal");
        return;
      }

      router.push("/labs");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-display">Masuk</h1>
          <p className="text-muted mt-2 text-sm">
            Lanjutkan perjalanan belajar-mu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-panel border border-line text-foreground placeholder:text-muted focus:outline-none focus:border-violet transition-colors"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-panel border border-line text-foreground placeholder:text-muted focus:outline-none focus:border-violet transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-violet text-white font-semibold hover:bg-violet-bright transition-colors"
          >
            Masuk
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Belum punya akun?{" "}
          <Link href="/register" className="text-cyan hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
