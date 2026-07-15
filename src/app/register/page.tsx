"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/labs";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, callbackURL: redirect }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || data.error || "Daftar gagal");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    }
  }

  async function handleGoogleSignIn() {
    try {
      const res = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google", callbackURL: redirect }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.token) {
        router.push(redirect);
        router.refresh();
      } else {
        setError("Login dengan Google belum dikonfigurasi.");
      }
    } catch {
      setError("Gagal memulai login Google");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-display">Daftar</h1>
          <p className="text-muted mt-2 text-sm">
            Mulai perjalanan belajarmu di SpectraSec Labs
          </p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-line bg-panel text-foreground hover:bg-panel-2 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Daftar dengan Google
        </button>

        <div className="flex items-center gap-3">
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          <span style={{ color: "var(--muted)", fontSize: 12 }}>atau daftar dengan email</span>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Nama</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Nama kamu" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="email@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Min. 6 karakter" />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full py-2.5 rounded-lg bg-violet text-white font-semibold hover:bg-violet-bright transition-colors">Daftar</button>
        </form>

        <p className="text-center text-sm text-muted">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-cyan hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div style={{ color: "var(--muted)" }}>Loading...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
