"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ChallengeActions({ id, published }: { id: string; published: boolean }) {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function request(url: string, method: "POST" | "DELETE") {
    setLoading(true); setError(""); const response = await fetch(url, { method }); const data = await response.json(); setLoading(false);
    if (!response.ok) { setError(data.error || "Action gagal"); return; } router.refresh();
  }
  return <div className="challenge-actions"><Link href={`/admin/challenges/${id}`} className="badge badge-violet">EDIT</Link><button disabled={loading} className="badge badge-cyan" onClick={() => request(`/api/challenges/${id}/toggle`, "POST")}>{published ? "UNPUBLISH" : "PUBLISH"}</button><button disabled={loading} className="badge badge-red" onClick={() => request(`/api/challenges/${id}`, "DELETE")}>DELETE</button>{error ? <span>{error}</span> : null}</div>;
}
