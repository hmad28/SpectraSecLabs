export const defaultAvatars = [
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZRKpQtfGBfs2Oxqkd3bX8V46ZrFtYlK9T1gya",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZDIHMcvVlZ8ysQS1jNfFRWXzg3OVrn24PMpai",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZLsxLRyf3u0dx1i769OvmFIUX8pRzG3kVLcth",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZdr9WbjXCnYqwO9j1cN6vlDIZihSMaLteXWHg",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZJFH9Yc4L9QeX7gjv5KBowHstS2nYR4xzAIOq",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZc4gg1Tww4It7KSVpRlhsfavu5xqyegWD8XCz",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZ433VPciyV7XJoKdfskpcmxLQC92WDOE6TeFl",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZafPQr8Izf4CRqdxI6c7G1D3mSWXNFYiPBlZV",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZJ69AaL4L9QeX7gjv5KBowHstS2nYR4xzAIOq",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZXqKzfGWykGJw2xsZKHvD8zfcbWdNYQlpFTgU",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZRY9Wi3DGBfs2Oxqkd3bX8V46ZrFtYlK9T1gy",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZ3DSHn49vTlGiN02ugoIfzAEUL8y3SxPsZkat",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZWWwUGCRnrcQBi9xkXjK4AIOdeat605gbZwCp",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZWnE5F5CRnrcQBi9xkXjK4AIOdeat605gbZwC",
  "https://blvuo7dgop.ufs.sh/f/9GKNFWsjEoSZhCyTTguvSXG8aqplxAy0kw6iodIrgzR3PM2t",
] as const;

const defaultAvatarSet = new Set<string>(defaultAvatars);

function indexAvatar(index: number) {
  const safeIndex = Number.isFinite(index) && index > 0 ? Math.floor(index) - 1 : 0;
  return defaultAvatars[safeIndex % defaultAvatars.length];
}

function legacyLocalAvatar(value: string) {
  const match = value.match(/\/images\/avatars\/avatar-(\d{2})\.svg$/);
  return match ? indexAvatar(Number(match[1])) : null;
}

function uploadedAvatar(value: string | null | undefined) {
  if (!value) return null;
  const legacy = legacyLocalAvatar(value);
  if (legacy) return null;
  if (defaultAvatarSet.has(value)) return null;
  if (value.includes("googleusercontent.com") || value.includes("ggpht.com")) return null;
  return value.startsWith("https://blvuo7dgop.ufs.sh/") ? value : null;
}

export function defaultAvatarForIndex(index: number | null | undefined) {
  return indexAvatar(index ?? 1);
}

export function defaultAvatarForSeed(seed: string | null | undefined) {
  const parsed = Number(seed?.match(/\d+/)?.[0] ?? 1);
  return defaultAvatarForIndex(parsed);
}

export function avatarForUser(user: { image?: string | null; avatarUrl?: string | null; avatarIndex?: number | null }) {
  return uploadedAvatar(user.image) || uploadedAvatar(user.avatarUrl) || defaultAvatarForIndex(user.avatarIndex ?? 1);
}

