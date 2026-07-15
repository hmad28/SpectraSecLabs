"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing-client";

type Status = "idle" | "saving" | "success" | "error";

async function postJson(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export function SettingsForm({ initialName, initialImage, email, emailVerified, hasPassword }: { initialName: string; initialImage?: string | null; email: string; emailVerified: boolean; hasPassword: boolean; }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
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
    const { response, data } = await postJson("/api/users/me", { name, image: image || null });
    if (!response.ok) {
      setProfileStatus("error");
      setProfileMessage(data.error || "Gagal menyimpan profil");
      return;
    }
    setProfileStatus("success");
    setProfileMessage("Profil berhasil diperbarui.");
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
    const { response, data } = await postJson("/api/users/password", body);
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
    const { response, data } = await postJson("/api/auth/email-otp/send-verification-otp", { email, type: "email-verification" });
    if (!response.ok) {
      setOtpStatus("error");
      setOtpMessage(data.message || data.error || "Gagal mengirim OTP");
      setSendingOtp(false);
      return;
    }
    setOtpStatus("success");
    setOtpMessage("OTP verifikasi sudah dikirim ke email kamu.");
    setSendingOtp(false);
  }

  async function verifyEmail(event: React.FormEvent) {
    event.preventDefault();
    setOtpStatus("saving");
    setOtpMessage("");
    const { response, data } = await postJson("/api/auth/email-otp/verify-email", { email, otp });
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
      <p className="eyebrow">PROFILE</p>
      <div className="form-group"><label className="form-label" htmlFor="display-name">Display name</label><input id="display-name" className="input" minLength={2} maxLength={80} required value={name} onChange={(event) => setName(event.target.value)} /></div>
      <div className="form-group"><label className="form-label">Avatar</label><div className="upload-zone"><UploadDropzone endpoint="avatar" onClientUploadComplete={(files) => { if (files[0]) setImage(files[0].url); }} onUploadError={(error) => { setProfileStatus("error"); setProfileMessage(error.message); }} /></div>{image ? <p className="form-hint">Avatar siap disimpan: {image.slice(0, 48)}...</p> : null}</div>
      {profileMessage ? <div className={`form-message ${profileStatus === "success" ? "success" : ""}`}>{profileMessage}</div> : null}
      <button className="btn btn-primary" disabled={profileStatus === "saving"}>{profileStatus === "saving" ? "Menyimpan..." : "Simpan Profil →"}</button>
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
      <p className="form-hint">Status email: {emailVerified ? "verified" : "pending verification"}. OTP dipakai untuk verifikasi dan reset password.</p>
      <form onSubmit={verifyEmail}>
        <div className="form-group"><label className="form-label" htmlFor="otp-email">Email</label><input id="otp-email" className="input" value={email} disabled /></div>
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

