export const defaultAvatars = [
  "/images/avatars/avatar-01.svg",
  "/images/avatars/avatar-02.svg",
  "/images/avatars/avatar-03.svg",
  "/images/avatars/avatar-04.svg",
  "/images/avatars/avatar-05.svg",
  "/images/avatars/avatar-06.svg",
  "/images/avatars/avatar-07.svg",
  "/images/avatars/avatar-08.svg",
  "/images/avatars/avatar-09.svg",
  "/images/avatars/avatar-10.svg",
  "/images/avatars/avatar-11.svg",
  "/images/avatars/avatar-12.svg",
  "/images/avatars/avatar-13.svg",
  "/images/avatars/avatar-14.svg",
  "/images/avatars/avatar-15.svg",
] as const;

function seedHash(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function defaultAvatarForSeed(seed: string | null | undefined) {
  const key = seed?.trim() || "spectrasec-operator";
  return defaultAvatars[seedHash(key) % defaultAvatars.length];
}

export function avatarForUser(user: { image?: string | null; avatarUrl?: string | null; id?: string | null; username?: string | null; email?: string | null }) {
  return user.image || user.avatarUrl || defaultAvatarForSeed(user.id || user.username || user.email);
}
