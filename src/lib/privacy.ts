import { createHash } from "crypto";

export type PublicUserIdentity = {
  username?: string | null;
  displayName?: string | null;
};

export function emailFingerprint(email: string) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

export function shortEmailFingerprint(email: string, length = 16) {
  return emailFingerprint(email).slice(0, length);
}

export function anonymousHandle(email: string) {
  return `operator_${shortEmailFingerprint(email, 8)}`;
}

export function playerHandle(user: PublicUserIdentity, email?: string | null) {
  return user.username?.trim() || user.displayName?.trim() || (email ? anonymousHandle(email) : "operator");
}
