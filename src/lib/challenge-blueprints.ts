export const challengeTracks = [
  { category: "web", label: "Web", focus: "Vulnerable web apps, auth bypass, injection, SSRF, IDOR", accent: "APP TARGET" },
  { category: "crypto", label: "Crypto", focus: "Weak ciphers, bad RSA, nonce reuse, homemade crypto", accent: "CIPHERTEXT" },
  { category: "forensic", label: "Forensic", focus: "PCAP, logs, memory traces, metadata, broken files", accent: "EVIDENCE" },
  { category: "osint", label: "OSINT", focus: "Public records, usernames, DNS, archive trails, geolocation", accent: "OPEN SOURCE" },
  { category: "reversing", label: "Reversing", focus: "Crackmes, validation logic, anti-debug notes, bytecode", accent: "BINARY" },
  { category: "pwn", label: "PWN", focus: "Stack bugs, format string, heap notes, ROP planning", accent: "EXPLOIT" },
  { category: "stego", label: "Stego", focus: "Hidden data in images, audio, metadata, embedded files", accent: "CARRIER" },
  { category: "misc", label: "Misc", focus: "Programming puzzles, esolang, QR, sanity, weird formats", accent: "ODDITY" },
] as const;

type ChallengeCategory = (typeof challengeTracks)[number]["category"];
type ChallengeDifficulty = "easy" | "medium" | "hard";

export type ChallengeResource = {
  name: string;
  path: string;
  size: number;
  kind: "target" | "artifact" | "service";
};

export type ChallengeBlueprint = {
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  points: number;
  title: string;
  description: string;
  flag: string;
  flagHint: string;
  resources: ChallengeResource[];
};

const levelPoints = { easy: [120, 150], medium: [240, 300], hard: [500] } as const;

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function flag(category: ChallengeCategory, title: string) {
  return `SPECTRA{${category}_${slugify(title).replaceAll("-", "_")}}`;
}

function artifact(title: string, extension = "txt"): ChallengeResource {
  const slug = slugify(title);
  return {
    name: `${slug}.${extension}`,
    path: `/api/challenge-artifacts/${slug}`,
    size: 4096,
    kind: "artifact",
  };
}

function webTarget(title: string): ChallengeResource {
  const slug = slugify(title);
  return {
    name: `${title} target`,
    path: `/targets/web/${slug}`,
    size: 0,
    kind: "target",
  };
}

function service(title: string): ChallengeResource {
  const slug = slugify(title);
  return {
    name: `${title} service notes`,
    path: `/api/challenge-artifacts/${slug}`,
    size: 6144,
    kind: "service",
  };
}

function makeChallenge(
  category: ChallengeCategory,
  difficulty: ChallengeDifficulty,
  points: number,
  title: string,
  scenario: string,
  objective: string,
  resource: ChallengeResource,
): ChallengeBlueprint {
  const computedFlag = flag(category, title);
  const resourceLabel = resource.kind === "target" ? "Target" : resource.kind === "service" ? "Service bundle" : "Artifact";
  return {
    category,
    difficulty,
    points,
    title,
    description: [
      `Scenario: ${scenario}`,
      "",
      `Objective: ${objective}`,
      "",
      `${resourceLabel}: buka resource yang tersedia di panel challenge. Flag tidak ada di deskripsi ini; kamu harus eksploitasi target atau analisis artifact.`,
      "",
      "Deliverable: submit flag final di format SPECTRA{...}.",
    ].join("\n"),
    flag: computedFlag,
    flagHint: "SPECTRA{lowercase_words_with_underscores}",
    resources: [resource],
  };
}

export const challengeBlueprints: ChallengeBlueprint[] = [
  makeChallenge("web", "easy", levelPoints.easy[0], "Proxy Leak", "Reverse proxy staging memantulkan debug trace ketika parameter tertentu aktif.", "Temukan cara membuka debug response dan baca flag dari internal trace.", webTarget("Proxy Leak")),
  makeChallenge("web", "easy", levelPoints.easy[1], "Cookie Relay", "Panel operator memakai cookie role mentah tanpa signing.", "Manipulasi cookie supaya panel menampilkan flag admin.", webTarget("Cookie Relay")),
  makeChallenge("web", "medium", levelPoints.medium[0], "Origin Split", "Validasi redirect hanya mengecek prefix host dan mudah dibingungkan.", "Bangun URL yang melewati allowlist dan membuka branch admin.", webTarget("Origin Split")),
  makeChallenge("web", "medium", levelPoints.medium[1], "Cache Shadow", "Endpoint profile punya cache key yang salah dan bisa dipaksa membaca user lain.", "Poison parameter cache untuk membaca profile admin.", webTarget("Cache Shadow")),
  makeChallenge("web", "hard", levelPoints.hard[0], "JWT Furnace", "Gateway menerima token dengan klaim role tetapi implementasi alg check lemah.", "Forge token mode none untuk membuka vault.", webTarget("JWT Furnace")),

  makeChallenge("crypto", "easy", levelPoints.easy[0], "Rotor Noise", "File berisi ciphertext Vigenere pendek dan crib yang cukup jelas.", "Pulihkan plaintext dari ciphertext dan ambil flag di akhir pesan.", artifact("Rotor Noise", "txt")),
  makeChallenge("crypto", "easy", levelPoints.easy[1], "Encoding Chain", "Payload dibungkus base64, hex, dan ROT13.", "Buka encoding secara berurutan sampai flag muncul.", artifact("Encoding Chain", "txt")),
  makeChallenge("crypto", "medium", levelPoints.medium[0], "Nonce Reuse", "Dua pesan dienkripsi dengan stream key yang sama.", "Gunakan XOR antar ciphertext untuk memulihkan pesan flag.", artifact("Nonce Reuse", "txt")),
  makeChallenge("crypto", "medium", levelPoints.medium[1], "RSA Small E", "Public key RSA memakai exponent kecil dan pesan tanpa padding.", "Recover plaintext dari ciphertext yang terlalu kecil.", artifact("RSA Small E", "txt")),
  makeChallenge("crypto", "hard", levelPoints.hard[0], "Hash Extension", "Service token memakai SHA256(secret || message).", "Buat token valid untuk role admin lewat length extension.", artifact("Hash Extension", "txt")),

  makeChallenge("forensic", "easy", levelPoints.easy[0], "Exif Dispatch", "Foto dispatch menyimpan catatan kamera dan komentar yang tidak terlihat di preview.", "Ekstrak metadata dan cari flag tersembunyi.", artifact("Exif Dispatch", "jpg")),
  makeChallenge("forensic", "easy", levelPoints.easy[1], "Broken Header", "File PNG rusak karena magic bytes berubah.", "Repair header file lalu baca pesan visualnya.", artifact("Broken Header", "png")),
  makeChallenge("forensic", "medium", levelPoints.medium[0], "Packet Echo", "Capture HTTP kecil menyimpan credential dan response internal.", "Rekonstruksi stream request untuk menemukan flag.", artifact("Packet Echo", "pcap")),
  makeChallenge("forensic", "medium", levelPoints.medium[1], "Auth Timeline", "Log auth berisi brute force, login sukses, dan command sensitif.", "Urutkan event dan temukan command yang mencetak flag.", artifact("Auth Timeline", "log")),
  makeChallenge("forensic", "hard", levelPoints.hard[0], "Memory Strings", "Dump memory ringkas berisi potongan proses dan string terpecah.", "Carve potongan string yang membentuk flag final.", artifact("Memory Strings", "dmp")),

  makeChallenge("osint", "easy", levelPoints.easy[0], "Handle Echo", "Satu handle dipakai ulang di beberapa profil komunitas.", "Cari alias final dari breadcrumb publik di artifact.", artifact("Handle Echo", "txt")),
  makeChallenge("osint", "easy", levelPoints.easy[1], "Geo Drift", "Foto lokasi punya signage dan bayangan yang cukup untuk mempersempit tempat.", "Tentukan landmark yang dimaksud dan baca flag dari note investigasi.", artifact("Geo Drift", "txt")),
  makeChallenge("osint", "medium", levelPoints.medium[0], "DNS Breadcrumb", "Subdomain lama masih muncul di zone history.", "Ikuti chain DNS dari root domain sampai host arsip.", artifact("DNS Breadcrumb", "txt")),
  makeChallenge("osint", "medium", levelPoints.medium[1], "Archive Shadow", "Snapshot lama situs menyimpan token sebelum disanitasi.", "Temukan timestamp snapshot yang benar dan ambil flag.", artifact("Archive Shadow", "txt")),
  makeChallenge("osint", "hard", levelPoints.hard[0], "Burned Alias", "Alias publik sengaja dihapus, tapi commit lama dan pola waktu masih tersisa.", "Gabungkan petunjuk username, commit, dan timezone.", artifact("Burned Alias", "txt")),

  makeChallenge("reversing", "easy", levelPoints.easy[0], "Branch Marker", "Crackme pseudo-C punya branch tersembunyi untuk input tertentu.", "Baca logic validasi dan temukan serial yang membuka flag.", artifact("Branch Marker", "c")),
  makeChallenge("reversing", "easy", levelPoints.easy[1], "String Trap", "String disamarkan dengan XOR satu byte.", "Decode string dari artifact dan ambil flag.", artifact("String Trap", "py")),
  makeChallenge("reversing", "medium", levelPoints.medium[0], "State Machine", "Validator bergerak lewat state A sampai F.", "Petakan transisi input yang menghasilkan accepted state.", artifact("State Machine", "txt")),
  makeChallenge("reversing", "medium", levelPoints.medium[1], "Patch Guard", "Pseudo assembly punya anti-tamper branch.", "Identifikasi branch yang harus dipatch dan baca flag.", artifact("Patch Guard", "asm")),
  makeChallenge("reversing", "hard", levelPoints.hard[0], "Opaque Loop", "Bytecode custom memakai opaque predicate untuk menyembunyikan konstanta.", "Deobfuscate bytecode dan rangkai konstanta flag.", artifact("Opaque Loop", "bin")),

  makeChallenge("pwn", "easy", levelPoints.easy[0], "Stack Frame", "Binary training punya buffer 32 byte dan fungsi win.", "Hitung offset overflow menuju win dan baca flag dari service notes.", service("Stack Frame")),
  makeChallenge("pwn", "easy", levelPoints.easy[1], "Format Leak", "Program printf memakai input langsung sebagai format string.", "Leak stack slot yang menyimpan flag pointer.", service("Format Leak")),
  makeChallenge("pwn", "medium", levelPoints.medium[0], "Canary Drift", "Canary bisa dibaca dari endpoint debug sebelum overflow.", "Gabungkan leak canary dan payload overwrite return.", service("Canary Drift")),
  makeChallenge("pwn", "medium", levelPoints.medium[1], "ROP Relay", "NX aktif dan binary punya gadget terbatas.", "Susun chain ret2win dari gadget list yang diberikan.", service("ROP Relay")),
  makeChallenge("pwn", "hard", levelPoints.hard[0], "Heap Note", "Note manager punya use-after-free pada chunk name.", "Bangun exploit plan untuk overwrite function pointer.", service("Heap Note")),

  makeChallenge("stego", "easy", levelPoints.easy[0], "LSB Lantern", "Gambar membawa pesan di bit terakhir channel biru.", "Ekstrak LSB dan susun teks flag.", artifact("LSB Lantern", "png")),
  makeChallenge("stego", "easy", levelPoints.easy[1], "Exif Whisper", "Metadata komentar menyimpan payload yang di-encode.", "Baca metadata dan decode payload.", artifact("Exif Whisper", "jpg")),
  makeChallenge("stego", "medium", levelPoints.medium[0], "Spectrogram Note", "Audio pendek menyimpan teks di domain frekuensi.", "Gunakan petunjuk spektrogram untuk membaca flag.", artifact("Spectrogram Note", "wav")),
  makeChallenge("stego", "medium", levelPoints.medium[1], "PNG Trailer", "File PNG punya ZIP kecil ditempel di akhir file.", "Carve trailer dan baca file flag di dalamnya.", artifact("PNG Trailer", "png")),
  makeChallenge("stego", "hard", levelPoints.hard[0], "Polyglot Vault", "Carrier valid sebagai gambar dan arsip sekaligus.", "Identifikasi format kedua, ekstrak vault, lalu decode flag.", artifact("Polyglot Vault", "bin")),

  makeChallenge("misc", "easy", levelPoints.easy[0], "Sanity Check", "Warm-up untuk memastikan format flag dan submit flow berjalan.", "Baca artifact dan submit flag sanity.", artifact("Sanity Check", "txt")),
  makeChallenge("misc", "easy", levelPoints.easy[1], "QR Pieces", "QR code dipecah jadi beberapa baris ASCII.", "Rakit kembali grid QR dan baca payload.", artifact("QR Pieces", "txt")),
  makeChallenge("misc", "medium", levelPoints.medium[0], "Esolang Tape", "Program Brainfuck kecil mencetak pesan tersembunyi.", "Jalankan atau interpretasikan program sampai flag keluar.", artifact("Esolang Tape", "bf")),
  makeChallenge("misc", "medium", levelPoints.medium[1], "Race Log", "Dua proses menulis log saling menyalip.", "Urutkan timestamp nanosecond untuk membaca flag.", artifact("Race Log", "log")),
  makeChallenge("misc", "hard", levelPoints.hard[0], "Constraint Box", "Puzzle constraint angka menghasilkan indeks karakter.", "Selesaikan constraint dan mapping indeks ke flag.", artifact("Constraint Box", "txt")),
];

export function findChallengeBlueprintBySlug(slug: string) {
  return challengeBlueprints.find((challenge) => slugify(challenge.title) === slug);
}

export function challengeSlug(title: string, category: ChallengeCategory) {
  return `${category}-${slugify(title)}`;
}
