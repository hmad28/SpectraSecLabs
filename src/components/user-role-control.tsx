"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserRoleControl({ userId, role, disabled }: { userId: string; role: "user" | "admin"; disabled?: boolean }) {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function change(nextRole: "user" | "admin") {
    setLoading(true); setError("");
    const response = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, role: nextRole }) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) { setError(data.error || "Gagal mengubah role"); return; }
    router.refresh();
  }
  return <div className="role-control"><select className="form-select role-select" aria-label="User role" value={role} disabled={disabled || loading} onChange={(event) => change(event.target.value as "user" | "admin")}><option value="user">User</option><option value="admin">Admin</option></select>{error ? <span className="role-error">{error}</span> : null}</div>;
}
