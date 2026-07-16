import { createHash } from "crypto";

export type PublicUserIdentity = {
  username?: string | null;
};

export function emailFingerprint(email: string) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

export function shortEmailFingerprint(email: string, length = 16) {
  return emailFingerprint(email).slice(0, length);
}

export function playerHandle(user: PublicUserIdentity) {
  return user.username?.trim() || "pending_username";
}
