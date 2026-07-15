"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendOtp() {
    setSending(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/auth/email-otp/send-verification-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, type: "email-verification" }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setError(data.message || data.error || "Gagal mengirim OTP."); return; }
      setMessage("OTP verifikasi sudah dikirim.");
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setSending(false);
    }
  }

  async function verifyEmail(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/auth/email-otp/verify-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setError(data.message || data.error || "OTP tidak valid."); return; }
      setMessage("Email berhasil diverifikasi. Silakan login.");
      router.push("/login?verified=1");
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setSaving(false);
    }
  }

  return <main className="auth-page">
    <section className="auth-visual"><Image src="/images/spectrasec-hero-terminal.svg" alt="" fill priority sizes="(max-width: 980px) 100vw, 58vw" /><div className="auth-visual-copy"><p className="eyebrow">VERIFY ACCESS</p><h2>Check.<br />Validate.<br />Unlock.</h2></div></section>
    <section className="auth-panel"><div className="auth-form reveal">
      <Link href="/" className="brand"><Image src="/images/spectrasec-logo.jpg" alt="" width={40} height={40} className="brand-logo" /><span>SPECTRASEC<span>.LABS</span></span></Link>
      <h1>Verifikasi email.</h1><p>Masukkan email lalu OTP yang kamu terima.</p>
      <div className="form-group"><label className="form-label" htmlFor="email">Email</label><input className="input" id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
      <div className="hero-actions" style={{ marginTop: 0 }}><button type="button" className="btn btn-ghost" onClick={sendOtp} disabled={sending}>{sending ? "Mengirim..." : "Kirim OTP"}</button></div>
      <form onSubmit={verifyEmail} style={{ marginTop: 18 }}>
        <div className="form-group"><label className="form-label" htmlFor="otp">OTP</label><input className="input" id="otp" inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value)} /></div>
        {error ? <div className="form-message">{error}</div> : null}
        {message ? <div className="form-message success">{message}</div> : null}
        <button className="btn btn-primary auth-submit" disabled={saving}>{saving ? "Memverifikasi..." : "Verifikasi Email →"}</button>
      </form>
      <p className="auth-switch"><Link href="/login">Kembali ke login</Link></p>
    </div></section>
  </main>;
}

export default function VerifyEmailPage() {
  return <Suspense><VerifyEmailForm /></Suspense>;
}
