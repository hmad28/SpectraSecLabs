"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing-client";

export function SettingsForm({ initialName, initialImage }: { initialName: string; initialImage?: string | null }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setStatus("saving"); setMessage("");
    const response = await fetch("/api/users/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, image: image || null }) });
    const data = await response.json();
    if (!response.ok) { setStatus("error"); setMessage(data.error || "Gagal menyimpan profil"); return; }
    setStatus("success"); setMessage("Profil berhasil diperbarui."); router.refresh();
  }
  return <form className="form-shell" onSubmit={submit}>
    <div className="form-group"><label className="form-label" htmlFor="display-name">Display name</label><input id="display-name" className="input" minLength={2} maxLength={80} required value={name} onChange={(event) => setName(event.target.value)} /></div>
    <div className="form-group"><label className="form-label">Avatar</label><div className="upload-zone"><UploadDropzone endpoint="avatar" onClientUploadComplete={(files) => { if (files[0]) setImage(files[0].url); }} onUploadError={(error) => { setStatus("error"); setMessage(error.message); }} /></div>{image ? <p className="form-hint">Avatar siap disimpan: {image.slice(0, 48)}...</p> : null}</div>
    {message ? <div className={`form-message ${status === "success" ? "success" : ""}`}>{message}</div> : null}
    <button className="btn btn-primary" disabled={status === "saving"}>{status === "saving" ? "Menyimpan..." : "Simpan Profil →"}</button>
  </form>;
}
