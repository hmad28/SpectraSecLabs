# SpectraSec Labs

> **Platform CTF Challenges** — Asah skill ethical hacking dan cyber security lewat tantangan.

SpectraSec Labs adalah platform Capture The Flag (CTF) challenges untuk komunitas cyber security Indonesia. Dibangun dengan Next.js, Neon DB, dan UploadThing — siap deploy di Vercel free tier.

---

## Fitur

- **7 Kategori Challenge** — Web, Crypto, Forensic, OSINT, Reversing, PWN, Misc
- **4 Level Kesulitan** — Easy, Medium, Hard, Insane
- **Leaderboard** — Peringkat pemain berdasarkan total poin
- **Dashboard Pemain** — Statistik, challenge yang diselesaikan, progres
- **Panel Admin** — CRUD challenges, kelola pengguna, lihat submission
- **File Uploads** — Upload file challenge via UploadThing
- **Auth** — Registrasi & login dengan Better Auth

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org/) |
| Bahasa | [TypeScript](https://www.typescriptlang.org/) |
| Database | [Neon DB](https://neon.tech/) (Postgres serverless) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Auth | [Better Auth](https://www.better-auth.com/) |
| Storage | [UploadThing](https://uploadthing.com/) |
| Styling | Pure CSS (dark cyber theme) |
| Deploy | [Vercel](https://vercel.com/) (free tier) |

## Cara Mulai

### 1. Clone & Install

```bash
git clone https://github.com/hmad28/SpectraSecLabs.git
cd SpectraSecLabs
npm install
```

### 2. Setup Environment

Salin `.env.example` ke `.env.local` dan isi konfigurasi:

```bash
cp .env.example .env.local
```

| Variable | Deskripsi |
|----------|-----------|
| `DATABASE_URL` | Connection string dari Neon DB |
| `BETTER_AUTH_SECRET` | Generate dengan `npx auth secret` |
| `BETTER_AUTH_URL` | URL aplikasi (http://localhost:3000 untuk dev) |
| `UPLOADTHING_TOKEN` | Token dari dashboard UploadThing |

### 3. Setup Database

```bash
npx drizzle-kit push
```

### 4. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### 5. Build untuk Production

```bash
npm run build
npm start
```

## Struktur Proyek

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel (CRUD challenges, users, submissions)
│   ├── api/                # API routes (auth, uploadthing)
│   ├── dashboard/          # User dashboard & settings
│   ├── labs/               # CTF challenges listing & detail
│   ├── leaderboard/        # Player rankings
│   ├── login/              # Login page
│   ├── register/           # Register page
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Design system (dark cyber theme)
├── components/
│   ├── ui/                 # UI primitives
│   ├── layout/             # Navbar, sidebar, footer
│   ├── labs/               # Challenge card, filters, flag submission
│   ├── leaderboard/        # Leaderboard table
│   ├── dashboard/          # User stats, settings form
│   └── admin/              # Challenge form, users table, submissions log
├── lib/
│   ├── db/                 # Drizzle schema & client
│   ├── auth/               # Better Auth config
│   └── utils.ts            # Utility helpers
└── middleware.ts            # Auth route protection
```

## Skrip

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm start` | Jalankan production server |
| `npm run lint` | Jalankan ESLint |

## Deploy ke Vercel

Project ini siap deploy ke Vercel. Hubungkan repository GitHub, set environment variables, dan deploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hmad28/SpectraSecLabs)

## Lisensi

Hak cipta © 2026 SpectraSec. Dibuat untuk komunitas cyber security Indonesia.
