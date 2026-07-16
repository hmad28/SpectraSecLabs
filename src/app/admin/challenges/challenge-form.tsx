"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing-client";
import { difficultyBasePoints } from "@/lib/scoring";

type ChallengeFile = { name: string; size: number; key: string; url: string };
type Values = { id?: string; title?: string; description?: string; category?: string; difficulty?: string; points?: number; flagHint?: string; isPublished?: boolean; files?: ChallengeFile[] };

export default function ChallengeForm({ defaultValues }: { defaultValues?: Values }) {
  const router = useRouter(); const editing = Boolean(defaultValues?.id);
  const [files, setFiles] = useState<ChallengeFile[]>(defaultValues?.files ?? []);
  const [difficulty, setDifficulty] = useState(defaultValues?.difficulty ?? "easy");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const payload = { id: defaultValues?.id, title: form.get("title"), description: form.get("description"), category: form.get("category"), difficulty: form.get("difficulty"), flag: form.get("flag"), flagHint: form.get("flagHint"), isPublished: form.get("isPublished") === "true", files };
    try {
      const response = await fetch("/api/challenges", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json(); if (!response.ok) { setError(data.error || "Gagal menyimpan challenge"); return; }
      router.push("/admin/challenges"); router.refresh();
    } catch { setError("Tidak dapat terhubung ke server"); } finally { setLoading(false); }
  }
  return <form className="form-shell" onSubmit={submit}>
    <div className="form-group"><label className="form-label" htmlFor="title">Judul challenge</label><input id="title" name="title" className="input" required maxLength={160} defaultValue={defaultValues?.title ?? ""} /></div>
    <div className="grid-2"><div className="form-group"><label className="form-label" htmlFor="category">Category</label><select id="category" name="category" className="form-select" defaultValue={defaultValues?.category ?? "web"}>{["web","crypto","forensic","osint","reversing","pwn","stego","misc"].map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}</select></div><div className="form-group"><label className="form-label" htmlFor="difficulty">Difficulty</label><select id="difficulty" name="difficulty" className="form-select" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>{["easy","medium","hard","insane"].map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}</select></div></div>
    <div className="grid-2"><div className="form-group"><label className="form-label">Base points</label><div className="input points-preview">{difficultyBasePoints[difficulty as keyof typeof difficultyBasePoints] ?? 50} pts</div><p className="form-hint">Auto dari difficulty. Pioneer bonus +30 dihitung saat first blood.</p></div><div className="form-group"><label className="form-label" htmlFor="isPublished">Status</label><select id="isPublished" name="isPublished" className="form-select" defaultValue={defaultValues?.isPublished ? "true" : "false"}><option value="false">DRAFT</option><option value="true">PUBLISHED</option></select></div></div>
    <div className="form-group"><label className="form-label" htmlFor="flag">Flag {editing ? "baru (opsional)" : ""}</label><input id="flag" name="flag" className="input" required={!editing} maxLength={512} placeholder="SPECTRA{...}" /><p className="form-hint">Flag di-hash bcrypt dan tidak pernah dikirim kembali oleh API.</p></div>
    <div className="form-group"><label className="form-label" htmlFor="flagHint">Flag format hint</label><input id="flagHint" name="flagHint" className="input" maxLength={255} defaultValue={defaultValues?.flagHint ?? ""} /></div>
    <div className="form-group"><label className="form-label" htmlFor="description">Deskripsi</label><textarea id="description" name="description" className="form-textarea" required maxLength={20000} defaultValue={defaultValues?.description ?? ""} /></div>
    <div className="form-group"><label className="form-label">Challenge files</label><div className="upload-zone"><UploadDropzone endpoint="challengeFile" onClientUploadComplete={(uploaded) => setFiles((current) => [...current, ...uploaded.map(({ name, size, key, url }) => ({ name, size, key, url }))].slice(0, 5))} onUploadError={(uploadError) => setError(uploadError.message)} /></div><div className="file-list">{files.map((file) => <div className="file-row" key={file.key}><span>{file.name} · {Math.max(1, Math.round(file.size / 1024))} KB</span><button type="button" onClick={() => setFiles((current) => current.filter((item) => item.key !== file.key))}>Hapus</button></div>)}</div></div>
    {error ? <div className="form-message">{error}</div> : null}<button className="btn btn-primary" disabled={loading}>{loading ? "Menyimpan..." : editing ? "Update Challenge →" : "Create Challenge →"}</button>
  </form>;
}

