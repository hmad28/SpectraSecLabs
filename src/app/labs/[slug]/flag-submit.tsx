"use client";

import { useState } from "react";

export default function FlagSubmit({
  challengeId,
  slug,
  solvedCount,
}: {
  challengeId: string;
  slug: string;
  solvedCount: number;
}) {
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "correct" | "wrong" | "duplicate">("idle");
  const [points, setPoints] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId, flag }),
      });

      const data = await res.json();

      if (data.correct) {
        if (data.alreadySolved) {
          setStatus("duplicate");
        } else {
          setStatus("correct");
          setPoints(data.points);
        }
      } else {
        setStatus("wrong");
      }
    } catch {
      setStatus("wrong");
    }
  }

  return (
    <div className="card" style={{ padding: 24, position: "sticky", top: 24 }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>
        Submit Flag
      </h3>
      <p style={{ color: "var(--muted)", fontSize: 12, margin: "0 0 16px" }}>
        {solvedCount} pemain berhasil menyelesaikan
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          className="input"
          type="text"
          placeholder="CTF{...}"
          value={flag}
          onChange={(e) => {
            setFlag(e.target.value);
            setStatus("idle");
          }}
          disabled={status === "loading"}
        />

        <button
          type="submit"
          className="btn btn-primary"
          style={{ justifyContent: "center", minHeight: 42 }}
          disabled={status === "loading" || !flag.trim()}
        >
          {status === "loading" ? "Memeriksa..." : "Submit"}
        </button>
      </form>

      {status === "correct" && (
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.25)", color: "var(--green)", fontSize: 13, textAlign: "center" }}>
          ✅ Benar! +{points} pts
        </div>
      )}

      {status === "duplicate" && (
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(234,179,8,.1)", border: "1px solid rgba(234,179,8,.25)", color: "var(--yellow)", fontSize: 13, textAlign: "center" }}>
          ⚠️ Kamu sudah menyelesaikan challenge ini
        </div>
      )}

      {status === "wrong" && (
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", color: "var(--red)", fontSize: 13, textAlign: "center" }}>
          ✗ Flag salah. Coba lagi.
        </div>
      )}
    </div>
  );
}
