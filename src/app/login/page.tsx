"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeRedirectPath } from "@/lib/validation";

function LoginForm() {
  const router = useRouter();
  const redirect = safeRedirectPath(useSearchParams().get("redirect"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/auth/sign-in/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, callbackURL: redirect }) });
      if (!response.ok) { const data = await response.json(); setError(data.message || "Email atau password salah."); return; }
      router.push(redirect); router.refresh();
    } catch { setError("Tidak dapat terhubung ke server."); } finally { setLoading(false); }
  }

  async function google() {
    setError("");
    try {
      const response = await fetch("/api/auth/sign-in/social", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider: "google", callbackURL: redirect }) });
      const data = await response.json();
      if (data.url) window.location.assign(data.url); else setError("Google login belum tersedia.");
    } catch { setError("Google login gagal dimulai."); }
  }

  return <main className="auth-page">
    <section className="auth-visual"><Image src="/images/spectrasec-hero.webp" alt="" fill priority sizes="(max-width: 980px) 100vw, 58vw" /><div className="auth-visual-copy"><p className="eyebrow">PLAYER ACCESS</p><h2>Return to<br />the signal.</h2></div></section>
    <section className="auth-panel"><div className="auth-form reveal">
      <Link href="/" className="brand"><Image src="/images/spectrasec-logo.jpg" alt="" width={40} height={40} className="brand-logo" /><span>SPECTRASEC<span>.LABS</span></span></Link>
      <h1>Masuk.</h1><p>Lanjutkan progres dan challenge-mu.</p>
      <button type="button" className="btn btn-ghost auth-social" onClick={google}>Lanjutkan dengan Google</button>
      <div className="auth-divider">ATAU EMAIL</div>
      <form onSubmit={submit}><div className="form-group"><label className="form-label" htmlFor="email">Email</label><input className="input" id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div><div className="form-group"><label className="form-label" htmlFor="password">Password</label><input className="input" id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></div>{error ? <div className="form-message">{error}</div> : null}<button className="btn btn-primary auth-submit" disabled={loading}>{loading ? "Memproses..." : "Masuk →"}</button></form>
      <p className="auth-switch">Belum punya akun? <Link href="/register">Daftar sekarang</Link></p>
    </div></section>
  </main>;
}

export default function LoginPage() { return <Suspense><LoginForm /></Suspense>; }
