"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChallengeForm({
  authorId,
  defaultValues,
}: {
  authorId: string;
  defaultValues?: {
    id?: string;
    title?: string;
    description?: string;
    category?: string;
    difficulty?: string;
    points?: number;
    flagHash?: string;
    flagHint?: string;
    isPublished?: boolean;
  };
}) {
  const router = useRouter();
  const isEdit = !!defaultValues?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title"),
      description: form.get("description"),
      category: form.get("category"),
      difficulty: form.get("difficulty"),
      points: parseInt(form.get("points") as string),
      flag: form.get("flag"),
      flagHint: form.get("flagHint"),
      isPublished: form.get("isPublished") === "true",
      authorId,
    };

    try {
      const res = await fetch("/api/challenges", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { ...data, id: defaultValues!.id } : data),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Gagal menyimpan challenge");
        return;
      }

      router.push("/admin/challenges");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="input"
          required
          defaultValue={defaultValues?.title || ""}
          placeholder="Nama challenge"
        />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            required
            defaultValue={defaultValues?.category || "web"}
          >
            <option value="web">Web</option>
            <option value="crypto">Crypto</option>
            <option value="forensic">Forensic</option>
            <option value="osint">OSINT</option>
            <option value="reversing">Reversing</option>
            <option value="pwn">PWN</option>
            <option value="misc">Misc</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="difficulty">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            className="form-select"
            required
            defaultValue={defaultValues?.difficulty || "easy"}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="insane">Insane</option>
          </select>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="points">
            Points
          </label>
          <input
            id="points"
            name="points"
            type="number"
            className="input"
            required
            min={1}
            defaultValue={defaultValues?.points || 100}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="isPublished">
            Status
          </label>
          <select
            id="isPublished"
            name="isPublished"
            className="form-select"
            defaultValue={defaultValues?.isPublished ? "true" : "false"}
          >
            <option value="false">Draft</option>
            <option value="true">Published</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="flag">
          Flag
        </label>
        <input
          id="flag"
          name="flag"
          type="text"
          className="input"
          required={!isEdit}
          placeholder="CTF{...}"
        />
        <p className="form-hint">Flag akan di-hash otomatis dengan bcrypt saat disimpan.</p>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="flagHint">
          Flag Format Hint (opsional)
        </label>
        <input
          id="flagHint"
          name="flagHint"
          type="text"
          className="input"
          defaultValue={defaultValues?.flagHint || ""}
          placeholder="Contoh: CTF{...}"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="form-textarea"
          required
          defaultValue={defaultValues?.description || ""}
          rows={8}
          placeholder="Deskripsi challenge, petunjuk, dan konteks tantangan"
        />
      </div>

      {error && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "rgba(239,68,68,.1)",
            border: "1px solid rgba(239,68,68,.25)",
            color: "var(--red)",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{ minWidth: 160, justifyContent: "center" }}
      >
        {loading ? "Menyimpan..." : isEdit ? "Update Challenge" : "Create Challenge"}
      </button>
    </form>
  );
}
