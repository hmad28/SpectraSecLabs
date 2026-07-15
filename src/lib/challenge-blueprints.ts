export const challengeTracks = [
  { category: "web", label: "Web", focus: "Proxy logic, auth flow, cache abuse, injection", accent: "ENTRY SURFACE" },
  { category: "crypto", label: "Crypto", focus: "Primitives, nonce reuse, encoding, weak construction", accent: "KEY MATERIAL" },
  { category: "forensic", label: "Forensic", focus: "Artifacts, metadata, timeline, memory residue", accent: "TRACE LAYER" },
  { category: "osint", label: "OSINT", focus: "Public breadcrumbs, naming drift, infra leaks", accent: "PUBLIC SIGNAL" },
  { category: "reversing", label: "Reversing", focus: "State machines, checks, control flow, decompilation", accent: "BINARY PATH" },
  { category: "pwn", label: "PWN", focus: "Memory corruption, heap state, ROP, sigreturn", accent: "MEMORY EDGE" },
  { category: "misc", label: "Misc", focus: "Automation, parsing, puzzle logic, odd formats", accent: "ALT ROUTE" },
] as const;

type ChallengeDifficulty = "easy" | "medium" | "hard";

export type ChallengeBlueprint = {
  category: (typeof challengeTracks)[number]["category"];
  difficulty: ChallengeDifficulty;
  points: number;
  title: string;
  description: string;
  flag: string;
  flagHint: string;
};

const easyPoints = [120, 150];
const mediumPoints = [240, 300];
const hardPoints = [500];

export const challengeBlueprints: ChallengeBlueprint[] = [
  {
    category: "web",
    difficulty: "easy",
    points: easyPoints[0],
    title: "Proxy Leak",
    description:
      "Portal staging internal menampilkan request trace di panel debug. Baca header yang ikut dipantulkan, lalu tarik flag dari response yang salah jalur.",
    flag: "SPECTRA{web_proxy_leak}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "web",
    difficulty: "easy",
    points: easyPoints[1],
    title: "Cookie Relay",
    description:
      "Cookie operator diproses oleh middleware yang terlalu percaya pada value user. Cari celah pada session marker dan paksa panel admin membuka token tersembunyi.",
    flag: "SPECTRA{web_cookie_relay}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "web",
    difficulty: "medium",
    points: mediumPoints[0],
    title: "Origin Split",
    description:
      "Aplikasi validasi origin hanya memeriksa string awal host. Gabungkan referer yang sah dengan rute fallback untuk mengeksekusi branch admin.",
    flag: "SPECTRA{web_origin_split}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "web",
    difficulty: "medium",
    points: mediumPoints[1],
    title: "Cache Shadow",
    description:
      "Edge cache menyimpan response yang semestinya personal. Rekayasa query parameter supaya konten privat tertulis ulang ke jalur publik.",
    flag: "SPECTRA{web_cache_shadow}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "web",
    difficulty: "hard",
    points: hardPoints[0],
    title: "JWT Furnace",
    description:
      "Signer JWT digabung dengan klaim yang lemah dan key derivation yang buruk. Naikkan privilege tanpa mengubah API contract yang terlihat.",
    flag: "SPECTRA{web_jwt_furnace}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "crypto",
    difficulty: "easy",
    points: easyPoints[0],
    title: "Rotor Noise",
    description:
      "Cipher klasik ini punya pengulangan periodik yang terlalu bersih. Temukan panjang kunci, pulihkan plaintext, dan baca flag dari blok akhir.",
    flag: "SPECTRA{crypto_rotor_noise}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "crypto",
    difficulty: "easy",
    points: easyPoints[1],
    title: "Base64 Dust",
    description:
      "Satu payload dibungkus dua kali sebelum masuk log. Buka lapisan encoding sampai string mentahnya kelihatan jelas.",
    flag: "SPECTRA{crypto_base64_dust}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "crypto",
    difficulty: "medium",
    points: mediumPoints[0],
    title: "Nonce Drift",
    description:
      "Dua ciphertext memakai nonce yang sama, lalu stream-nya bocor di tempat berbeda. Rekonstruksi pesan asli dari XOR antara keduanya.",
    flag: "SPECTRA{crypto_nonce_drift}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "crypto",
    difficulty: "medium",
    points: mediumPoints[1],
    title: "Padlock Reuse",
    description:
      "Padding oracle tidak langsung muncul, tapi kesalahan implementasi memberi sinyal yang cukup. Pisahkan noise dari validasi untuk membaca block terakhir.",
    flag: "SPECTRA{crypto_padlock_reuse}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "crypto",
    difficulty: "hard",
    points: hardPoints[0],
    title: "KDF Collapse",
    description:
      "Turunan kunci terlalu deterministik dan salt dipakai ulang di banyak akun. Gabungkan kelemahan itu untuk memulihkan secret final.",
    flag: "SPECTRA{crypto_kdf_collapse}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "forensic",
    difficulty: "easy",
    points: easyPoints[0],
    title: "Thumbcache Trace",
    description:
      "Artifact thumbnail menyimpan file yang tidak terlihat di folder utama. Buka jejak metadata, lalu baca string yang disembunyikan di akhir buffer.",
    flag: "SPECTRA{forensic_thumbcache_trace}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "forensic",
    difficulty: "easy",
    points: easyPoints[1],
    title: "Slack Dust",
    description:
      "Percakapan lama terpotong, tapi autosave masih menahan fragmen penting. Rekonstruksi timeline dari potongan yang tersisa.",
    flag: "SPECTRA{forensic_slack_dust}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "forensic",
    difficulty: "medium",
    points: mediumPoints[0],
    title: "Packet Echo",
    description:
      "Capture jaringan mengandung request yang hilang di tengah retransmit. Ikuti sesi dari awal sampai token tersembunyi muncul kembali.",
    flag: "SPECTRA{forensic_packet_echo}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "forensic",
    difficulty: "medium",
    points: mediumPoints[1],
    title: "Process Hollow",
    description:
      "Memory snapshot menampilkan proses yang kelihatannya normal, tapi ada region aneh di address space. Temukan payload yang ditanam ke situ.",
    flag: "SPECTRA{forensic_process_hollow}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "forensic",
    difficulty: "hard",
    points: hardPoints[0],
    title: "Timeline Stitch",
    description:
      "Gabungkan log endpoint, browser cache, dan system artifacts untuk menyusun urutan kejadian yang benar. Flag ada di langkah terakhir.",
    flag: "SPECTRA{forensic_timeline_stitch}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "osint",
    difficulty: "easy",
    points: easyPoints[0],
    title: "Handle Echo",
    description:
      "Username yang sama dipakai di beberapa platform dengan variasi kecil. Cari handle aslinya dan cocokkan jejak publik yang konsisten.",
    flag: "SPECTRA{osint_handle_echo}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "osint",
    difficulty: "easy",
    points: easyPoints[1],
    title: "Geo Drift",
    description:
      "Satu foto menyimpan petunjuk latar yang cukup untuk mempersempit lokasi. Cocokkan signage, bentuk atap, dan arah bayangan.",
    flag: "SPECTRA{osint_geo_drift}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "osint",
    difficulty: "medium",
    points: mediumPoints[0],
    title: "DNS Breadcrumb",
    description:
      "Subdomain lama masih hidup di zone history. Rekonfigurasi jejak DNS untuk menemukan endpoint yang tidak lagi dipasarkan.",
    flag: "SPECTRA{osint_dns_breadcrumb}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "osint",
    difficulty: "medium",
    points: mediumPoints[1],
    title: "Archive Shadow",
    description:
      "Versi lama dari sebuah situs masih tersimpan di archive dan menyimpan referensi yang disembunyikan operator. Cari snapshot sebelum sanitasi terjadi.",
    flag: "SPECTRA{osint_archive_shadow}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "osint",
    difficulty: "hard",
    points: hardPoints[0],
    title: "Burned Alias",
    description:
      "Seseorang sengaja membakar identitas publiknya, tapi kebiasaan bahasa dan jam posting masih bocor. Saling silang petunjuk itu sampai alias aslinya muncul.",
    flag: "SPECTRA{osint_burned_alias}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "reversing",
    difficulty: "easy",
    points: easyPoints[0],
    title: "Branch Marker",
    description:
      "Binary kecil punya check sederhana sebelum flag dicetak. Ikuti branch yang tidak pernah dipakai user normal.",
    flag: "SPECTRA{reversing_branch_marker}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "reversing",
    difficulty: "easy",
    points: easyPoints[1],
    title: "String Trap",
    description:
      "String penting kelihatan samar di binary, tapi bukan di tempat pertama yang kamu lihat. Lacak referensinya sampai fungsi validasi ketemu.",
    flag: "SPECTRA{reversing_string_trap}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "reversing",
    difficulty: "medium",
    points: mediumPoints[0],
    title: "State Machine",
    description:
      "Program ini bergerak lewat status yang bergantung pada input urutan tertentu. Petakan transisinya, lalu re-create urutan yang membuka jalur flag.",
    flag: "SPECTRA{reversing_state_machine}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "reversing",
    difficulty: "medium",
    points: mediumPoints[1],
    title: "Patch Guard",
    description:
      "Checksum dan anti-tamper terlihat kuat, tapi ada satu point of failure di loader. Bypass guard itu tanpa merusak runtime sepenuhnya.",
    flag: "SPECTRA{reversing_patch_guard}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "reversing",
    difficulty: "hard",
    points: hardPoints[0],
    title: "Opaque Loop",
    description:
      "Obfuscation memaksa kamu melewati loop yang tampak tak berujung. Rekonstruksi logika aslinya dan ambil flag dari jalur yang disembunyikan.",
    flag: "SPECTRA{reversing_opaque_loop}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "pwn",
    difficulty: "easy",
    points: easyPoints[0],
    title: "Stack Frame",
    description:
      "Binary membaca input tanpa batas, tapi hanya satu return path yang benar-benar penting. Ambil kontrol stack lalu lompat ke fungsi flag.",
    flag: "SPECTRA{pwn_stack_frame}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "pwn",
    difficulty: "easy",
    points: easyPoints[1],
    title: "Canary Drift",
    description:
      "Proteksi stack ada, tetapi perilaku program membocorkan perubahan kecil pada guard value. Gunakan bocoran itu untuk melewati boundary.",
    flag: "SPECTRA{pwn_canary_drift}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "pwn",
    difficulty: "medium",
    points: mediumPoints[0],
    title: "Heap Note",
    description:
      "Allocator menulis catatan internal ke chunk yang bisa kamu baca kembali. Gunakan info leak itu untuk menata ulang target berikutnya.",
    flag: "SPECTRA{pwn_heap_note}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "pwn",
    difficulty: "medium",
    points: mediumPoints[1],
    title: "ROP Relay",
    description:
      "Gadget tidak banyak, tapi cukup untuk merangkai syscall chain. Susun ROP yang stabil dan kirim relay menuju function penutup.",
    flag: "SPECTRA{pwn_rop_relay}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "pwn",
    difficulty: "hard",
    points: hardPoints[0],
    title: "Sigreturn Gate",
    description:
      "Antarmuka input memaksa eksekusi kembali lewat jalur signal frame. Bentuk frame yang pas dan lewati gate terakhir.",
    flag: "SPECTRA{pwn_sigreturn_gate}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "misc",
    difficulty: "easy",
    points: easyPoints[0],
    title: "Pattern Drift",
    description:
      "Satu file teks terlihat acak, tapi pola pengulangan membentuk pesan yang rapi. Susun barisnya ulang dan baca output final.",
    flag: "SPECTRA{misc_pattern_drift}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "misc",
    difficulty: "easy",
    points: easyPoints[1],
    title: "Bitflip",
    description:
      "Satu bit yang salah bisa mengubah pesan normal jadi flag. Cari posisi yang paling mahal untuk dibetulkan secara manual.",
    flag: "SPECTRA{misc_bitflip}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "misc",
    difficulty: "medium",
    points: mediumPoints[0],
    title: "Encoder Maze",
    description:
      "Payload melewati beberapa encoder dan hasilnya terlihat tidak konsisten. Buka lapisan secara urut sampai teks aslinya muncul.",
    flag: "SPECTRA{misc_encoder_maze}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "misc",
    difficulty: "medium",
    points: mediumPoints[1],
    title: "Race Condition",
    description:
      "Ada dua proses yang saling menyalip ketika resource yang sama dibuka. Manfaatkan timing window itu untuk mendapatkan state yang diinginkan.",
    flag: "SPECTRA{misc_race_condition}",
    flagHint: "SPECTRA{...}",
  },
  {
    category: "misc",
    difficulty: "hard",
    points: hardPoints[0],
    title: "Unknown Unknown",
    description:
      "Challenge ini sengaja memaksa kamu membaca sinyal yang tidak jelas dari berbagai format. Satukan semuanya sampai flag terakhir muncul.",
    flag: "SPECTRA{misc_unknown_unknown}",
    flagHint: "SPECTRA{...}",
  },
];
