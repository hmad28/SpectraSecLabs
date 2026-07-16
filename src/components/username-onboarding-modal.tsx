"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;

export function UsernameOnboardingModal() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const handle = username.trim().toLowerCase();
    if (!USERNAME_PATTERN.test(handle)) {
      setStatus("error");
      setMessage("Username harus 3-24 karakter: huruf kecil, angka, atau underscore.");
      return;
    }
    setStatus("saving");
    setMessage("");
    const response = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: handle }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error || "Gagal menyimpan username.");
      return;
    }
    router.refresh();
  }

  return <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="username-onboarding-title">
    <form className="onboarding-card" onSubmit={submit}>
      <p className="eyebrow">SET OPERATOR HANDLE</p>
      <h2 id="username-onboarding-title">Pilih username dulu.</h2>
      <p>Di komunitas cybersec, leaderboard pakai handle. Jangan pakai nama asli. Username ini yang tampil di ranking, solve, dan podium.</p>
      <div className="form-group"><label className="form-label" htmlFor="onboarding-username">Username</label><input id="onboarding-username" className="input" autoFocus required minLength={3} maxLength={24} pattern="[a-z0-9_]+" autoComplete="username" value={username} onChange={(event) => { setUsername(event.target.value.toLowerCase()); setStatus("idle"); }} placeholder="contoh: rootkit_kid" /><p className="form-hint">Huruf kecil, angka, underscore. 3-24 karakter.</p></div>
      {message ? <div className="form-message">{message}</div> : null}
      <button className="btn btn-primary" disabled={status === "saving"}>{status === "saving" ? "Menyimpan..." : "Aktifkan Username →"}</button>
    </form>
  </div>;
}
