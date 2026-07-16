"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeRedirectPath } from "@/lib/validation";

const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirectPath(params.get("redirect"), "/dashboard");
  const [username, setUsername] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    const handle = username.trim().toLowerCase();
    if (!USERNAME_PATTERN.test(handle)) { setError("Username harus 3-24 karakter: huruf kecil, angka, atau underscore."); setLoading(false); return; }
    try {
      const response = await fetch("/api/auth/sign-up/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: handle, username: handle, displayName: handle, email, password, callbackURL: redirect }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setError(data.message || "Pendaftaran gagal."); return; }
      if (data.user && data.user.emailVerified === false) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        router.refresh();
        return;
      }
      router.push(redirect); router.refresh();
    } catch { setError("Tidak dapat terhubung ke server."); } finally { setLoading(false); }
  }
  async function google() {
    setError("");
    try { const response = await fetch("/api/auth/sign-in/social", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider: "google", callbackURL: redirect }) }); const data = await response.json(); if (data.url) window.location.assign(data.url); else setError("Google login belum tersedia."); }
    catch { setError("Google login gagal dimulai."); }
  }
  return <main className="auth-page">
    <section className="auth-visual"><Image src="/images/spectrasec-hero-terminal.svg" alt="" fill priority sizes="(max-width: 980px) 100vw, 58vw" /><div className="auth-visual-copy"><p className="eyebrow">NEW OPERATOR</p><h2>Join.<br />Verify.<br />Exploit.</h2></div></section>
    <section className="auth-panel"><div className="auth-form reveal">
      <Link href="/" className="brand"><Image src="/images/spectrasec-logo.jpg" alt="" width={40} height={40} className="brand-logo" /><span>SPECTRASEC<span>.LABS</span></span></Link>
      <h1>Daftar.</h1><p>Buat operator handle, lalu verifikasi email dengan OTP.</p>
      <button type="button" className="btn btn-ghost auth-social" onClick={google}>Daftar dengan Google</button><div className="auth-divider">ATAU EMAIL</div>
      <form onSubmit={submit}><div className="form-group"><label className="form-label" htmlFor="username">Username</label><input className="input" id="username" required minLength={3} maxLength={24} pattern="[a-z0-9_]+" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value.toLowerCase())} /><p className="form-hint">Pakai handle, bukan nama asli.</p></div><div className="form-group"><label className="form-label" htmlFor="email">Email</label><input className="input" id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div><div className="form-group"><label className="form-label" htmlFor="password">Password</label><input className="input" id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /><p className="form-hint">Minimum 8 karakter.</p></div>{error ? <div className="form-message">{error}</div> : null}<button className="btn btn-primary auth-submit" disabled={loading}>{loading ? "Memproses..." : "Buat Akun →"}</button></form>
      <p className="auth-switch">Sudah terdaftar? <Link href="/login">Masuk</Link></p>
    </div></section>
  </main>;
}
export default function RegisterPage() { return <Suspense><RegisterForm /></Suspense>; }



