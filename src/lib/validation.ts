export const challengeCategories = ["web", "crypto", "forensic", "osint", "reversing", "pwn", "misc"] as const;
export const challengeDifficulties = ["easy", "medium", "hard", "insane"] as const;

function oneOf<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === "string" && allowed.includes(value);
}

function requiredText(value: unknown, field: string, max: number) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} wajib diisi`);
  const result = value.trim();
  if (result.length > max) throw new Error(`${field} maksimal ${max} karakter`);
  return result;
}

export function parseChallengeInput(value: unknown, requireFlag: boolean) {
  if (!value || typeof value !== "object") throw new Error("Payload tidak valid");
  const input = value as Record<string, unknown>;
  const points = Number(input.points);
  const flag = typeof input.flag === "string" ? input.flag.trim() : "";
  if (!oneOf(input.category, challengeCategories)) throw new Error("Kategori tidak valid");
  if (!oneOf(input.difficulty, challengeDifficulties)) throw new Error("Difficulty tidak valid");
  if (!Number.isInteger(points) || points < 1 || points > 10_000) throw new Error("Poin harus 1-10000");
  if (requireFlag && !flag) throw new Error("Flag wajib diisi");
  if (flag.length > 512) throw new Error("Flag maksimal 512 karakter");

  const files = (Array.isArray(input.files) ? input.files : []).slice(0, 5).map((file) => {
    if (!file || typeof file !== "object") throw new Error("File tidak valid");
    const item = file as Record<string, unknown>;
    const size = Number(item.size);
    const url = requiredText(item.url, "URL file", 2048);
    if (!url.startsWith("https://")) throw new Error("URL file tidak valid");
    if (!Number.isInteger(size) || size < 0 || size > 32 * 1024 * 1024) throw new Error("Ukuran file tidak valid");
    return { name: requiredText(item.name, "Nama file", 255), key: requiredText(item.key, "Storage key", 255), url, size };
  });

  return {
    title: requiredText(input.title, "Judul", 160),
    description: requiredText(input.description, "Deskripsi", 20_000),
    category: input.category,
    difficulty: input.difficulty,
    points,
    flag,
    flagHint: typeof input.flagHint === "string" && input.flagHint.trim() ? input.flagHint.trim().slice(0, 255) : null,
    isPublished: input.isPublished === true,
    files,
  };
}

export function safeRedirectPath(value: string | null, fallback = "/labs") {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
