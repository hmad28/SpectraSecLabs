"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing-client";

type Status = "idle" | "saving" | "success" | "error";

async function requestJson(path: string, method: "POST" | "PUT", body: Record<string, unknown>) {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export function SettingsForm({ initialUsername, initialImage, emailHash, emailVerified, hasPassword }: { initialUsername: string; initialImage?: string | null; emailHash: string; emailVerified: boolean; hasPassword: boolean; }) {
  const router = useRouter();
  const [username, setUsername] = useState(initialUsername);
  const [image, setImage] = useState(initialImage ?? "");
  const [profileStatus, setProfileStatus] = useState<Status>("idle");
  const [profileMessage, setProfileMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<Status>("idle");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState<Status>("idle");
  const [otpMessage, setOtpMessage] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setProfileStatus("saving");
    setProfileMessage("");
    const normalizedUsername = username.trim().toLowerCase();
    const { response, data } = await requestJson("/api/users/me", "PUT", { username: normalizedUsername, image: image || null });
    if (!response.ok) {
      setProfileStatus("error");
      setProfileMessage(data.error || "Gagal menyimpan profil");
      return;
    }
    setUsername(data.username || normalizedUsername);
    setProfileStatus("success");
    setProfileMessage("Username berhasil diperbarui.");
    router.refresh();
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus("error");
      setPasswordMessage("Password baru tidak cocok.");
      return;
    }
    setPasswordStatus("saving");
    setPasswordMessage("");
    const body = hasPassword ? { currentPassword, newPassword } : { newPassword };
    const { response, data } = await requestJson("/api/users/password", "POST", body);
    if (!response.ok) {
      setPasswordStatus("error");
      setPasswordMessage(data.message || data.error || "Gagal menyimpan password");
      return;
    }
    setPasswordStatus("success");
    setPasswordMessage(hasPassword ? "Password berhasil diperbarui." : "Password berhasil ditambahkan.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    router.refresh();
  }

  async function sendVerificationOtp() {
    setSendingOtp(true);
    setOtpStatus("idle");
    setOtpMessage("");
    const { response, data } = await requestJson("/api/users/email-verification", "POST", {});
    if (!response.ok) {
      setOtpStatus("error");
      setOtpMessage(data.message || data.error || "Gagal mengirim OTP");
      setSendingOtp(false);
      return;
    }
    setOtpStatus("success");
    setOtpMessage("OTP verifikasi sudah dikirim ke email akun kamu.");
    setSendingOtp(false);
  }

  async function verifyEmail(event: React.FormEvent) {
    event.preventDefault();
    setOtpStatus("saving");
    setOtpMessage("");
    const { response, data } = await requestJson("/api/users/email-verification", "PUT", { otp });
    if (!response.ok) {
      setOtpStatus("error");
      setOtpMessage(data.message || data.error || "OTP tidak valid");
      return;
    }
    setOtpStatus("success");
    setOtpMessage("Email berhasil diverifikasi.");
    setOtp("");
    router.refresh();
  }

  return <div className="form-shell">
    <form className="card" onSubmit={saveProfile}>
      <p className="eyebrow">OPERATOR HANDLE</p>
      <div className="form-group"><label className="form-label" htmlFor="username">Username</label><input id="username" className="input" minLength={3} maxLength={24} pattern="[a-z0-9_]+" required value={username} onChange={(event) => setUsername(event.target.value.toLowerCase())} /><p className="form-hint">Identitas publik. Pakai handle, bukan nama asli. Format: huruf kecil, angka, underscore.</p></div>
      <div className="form-group"><label className="form-label">Avatar</label><div className="upload-zone"><UploadDropzone endpoint="avatar" onClientUploadComplete={(files) => { if (files[0]) setImage(files[0].url); }} onUploadError={(error) => { setProfileStatus("error"); setProfileMessage(error.message); }} /></div>{image ? <p className="form-hint">Avatar siap disimpan: {image.slice(0, 48)}...</p> : null}</div>
      {profileMessage ? <div className={`form-message ${profileStatus === "success" ? "success" : ""}`}>{profileMessage}</div> : null}
      <button className="btn btn-primary" disabled={profileStatus === "saving"}>{profileStatus === "saving" ? "Menyimpan..." : "Simpan Username →"}</button>
    </form>

    <form className="card" onSubmit={savePassword} style={{ marginTop: 16 }}>
      <p className="eyebrow">PASSWORD</p>
      <p className="form-hint">{hasPassword ? "Akun ini sudah punya password. Perbarui kalau perlu." : "Akun Google belum punya password. Tambahkan supaya bisa login manual."}</p>
      {hasPassword ? <div className="form-group"><label className="form-label" htmlFor="current-password">Password saat ini</label><input id="current-password" className="input" type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></div> : null}
      <div className="form-group"><label className="form-label" htmlFor="new-password">Password baru</label><input id="new-password" className="input" type="password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></div>
      <div className="form-group"><label className="form-label" htmlFor="confirm-password">Konfirmasi password</label><input id="confirm-password" className="input" type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div>
      {passwordMessage ? <div className={`form-message ${passwordStatus === "success" ? "success" : ""}`}>{passwordMessage}</div> : null}
      <button className="btn btn-primary" disabled={passwordStatus === "saving"}>{passwordStatus === "saving" ? (hasPassword ? "Menyimpan..." : "Menetapkan...") : (hasPassword ? "Ubah Password →" : "Set Password →")}</button>
    </form>

    <div className="card" style={{ marginTop: 16 }}>
      <p className="eyebrow">EMAIL OTP</p>
      <p className="form-hint">Email hash: <code>{emailHash}</code>. Status: {emailVerified ? "verified" : "pending verification"}. Email mentah tidak ditampilkan di UI publik.</p>
      <form onSubmit={verifyEmail}>
        <div className="form-group"><label className="form-label" htmlFor="otp-code">OTP</label><input id="otp-code" className="input" inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="123456" /></div>
        {otpMessage ? <div className={`form-message ${otpStatus === "success" ? "success" : ""}`}>{otpMessage}</div> : null}
        <div className="hero-actions" style={{ marginTop: 0 }}>
          <button type="button" className="btn btn-ghost" onClick={sendVerificationOtp} disabled={sendingOtp}>{sendingOtp ? "Mengirim..." : "Kirim OTP"}</button>
          <button className="btn btn-primary" disabled={otpStatus === "saving" || !otp.trim()}>{otpStatus === "saving" ? "Memverifikasi..." : "Verifikasi Email →"}</button>
        </div>
      </form>
    </div>
  </div>;
}


