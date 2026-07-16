"use client";

import { useState } from "react";

export default function FlagSubmit({ challengeId, solvedCount }: { challengeId: string; solvedCount: number }) {
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "correct" | "wrong" | "duplicate">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challengeId, flag }) });
      const data = await response.json();
      if (!response.ok) { setStatus("wrong"); setMessage(data.error || "Submission gagal"); return; }
      if (!data.correct) { setStatus("wrong"); setMessage("Flag belum tepat. Periksa kembali analisismu."); return; }
      if (data.alreadySolved) { setStatus("duplicate"); setMessage("Challenge ini sudah pernah kamu selesaikan."); return; }
      setStatus("correct"); setMessage(data.pioneer ? `FIRST BLOOD. +${data.points} poin (${data.basePoints}+${data.pioneerBonus}).` : `Verified solve. +${data.points} poin.`); setFlag("");
    } catch {
      setStatus("wrong"); setMessage("Tidak dapat terhubung ke server.");
    }
  }

  return <aside className="card challenge-submit reveal reveal-delay">
    <p className="eyebrow">VERIFY SOLUTION</p><h2>Submit flag.</h2><p className="submit-copy">{solvedCount} verified solve · {solvedCount === 0 ? "Pioneer bonus +30 masih terbuka" : "Pioneer sudah terklaim"}</p>
    <form onSubmit={handleSubmit}><input className="input" aria-label="Flag" type="text" maxLength={512} placeholder="SPECTRA{...}" value={flag} onChange={(event) => { setFlag(event.target.value); setStatus("idle"); }} disabled={status === "loading"} /><button className="btn btn-primary submit-button" disabled={status === "loading" || !flag.trim()}>{status === "loading" ? "Memverifikasi..." : "Submit Flag →"}</button></form>
    {status !== "idle" && status !== "loading" ? <div className={`submit-result ${status}`}>{message}</div> : null}
    <p className="scope-note">Hanya praktikkan teknik pada lab atau sistem dengan izin eksplisit.</p>
  </aside>;
}

