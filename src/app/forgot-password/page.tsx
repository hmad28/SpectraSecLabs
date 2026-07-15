"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

function ForgotPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendOtp() {
    setSending(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/auth/email-otp/request-password-reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setError(data.message || data.error || "Gagal mengirim OTP."); return; }
      setMessage("OTP reset password sudah dikirim.");
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setSending(false);
    }
  }

  async function resetPassword(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirmPassword) { setError("Password baru tidak cocok."); return; }
    setSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/auth/email-otp/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp, password }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setError(data.message || data.error || "OTP atau password tidak valid."); return; }
      setMessage("Password berhasil direset. Silakan login lagi.");
      router.push("/login?reset=1");
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setSaving(false);
    }
  }

  return <main className="auth-page">
    <section className="auth-visual"><Image src="/images/spectrasec-hero-terminal.svg" alt="" fill priority sizes="(max-width: 980px) 100vw, 58vw" /><div className="auth-visual-copy"><p className="eyebrow">ACCESS RECOVERY</p><h2>Recover.<br />Rotate.<br />Re-enter.</h2></div></section>
    <section className="auth-panel"><div className="auth-form reveal">
      <Link href="/" className="brand"><Image src="/images/spectrasec-logo.jpg" alt="" width={40} height={40} className="brand-logo" /><span>SPECTRASEC<span>.LABS</span></span></Link>
      <h1>Lupa password.</h1><p>Ambil OTP, lalu set password baru.</p>
      <div className="form-group"><label className="form-label" htmlFor="email">Email</label><input className="input" id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
      <div className="hero-actions" style={{ marginTop: 0 }}><button type="button" className="btn btn-ghost" onClick={sendOtp} disabled={sending}>{sending ? "Mengirim..." : "Kirim OTP"}</button></div>
      <form onSubmit={resetPassword} style={{ marginTop: 18 }}>
        <div className="form-group"><label className="form-label" htmlFor="otp">OTP</label><input className="input" id="otp" inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value)} /></div>
        <div className="form-group"><label className="form-label" htmlFor="password">Password baru</label><input className="input" id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></div>
        <div className="form-group"><label className="form-label" htmlFor="confirm-password">Konfirmasi password</label><input className="input" id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div>
        {error ? <div className="form-message">{error}</div> : null}
        {message ? <div className="form-message success">{message}</div> : null}
        <button className="btn btn-primary auth-submit" disabled={saving}>{saving ? "Mereset..." : "Reset Password →"}</button>
      </form>
      <p className="auth-switch"><Link href="/login">Kembali ke login</Link></p>
    </div></section>
  </main>;
}

export default function ForgotPasswordPage() {
  return <Suspense><ForgotPasswordForm /></Suspense>;
}
