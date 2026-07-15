# SpectraSec Labs

Platform CTF untuk komunitas cyber security SpectraSec. Labs memakai Next.js App Router, Neon Postgres, Better Auth, UploadThing, dan Vercel serverless.

## Fitur

- Landing page dan visual system cyber-research yang konsisten dengan SpectraSec.
- Challenge archive dengan filter kategori, difficulty, publish/unpublish, dan file artefak.
- Auth email/password dan Google OAuth melalui Better Auth.
- Submission flag dengan fingerprint non-reversible, rate limit, dan unique solve atomic.
- Dashboard player, leaderboard, profile settings, dan avatar upload.
- Admin control room: challenge CRUD, UploadThing, user roles, dan audit submissions.

## Local Setup

```bash
npm install
Copy-Item .env.example .env.local
npm run db:push
npm run db:backfill
npm run seed
npm run dev
```

Environment variables yang diperlukan:

```text
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
UPLOADTHING_TOKEN
SUPER_ADMIN_EMAIL
SUPER_ADMIN_PASSWORD
GOOGLE_CLIENT_ID       # optional
GOOGLE_CLIENT_SECRET   # optional
```

`.env.local` tidak boleh dikomit. Token yang pernah dibagikan di luar secret manager harus di-rotate sebelum production.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm test` | Validation tests |
| `npm run build` | Production build |
| `npm run db:push` | Apply schema changes to Neon |
| `npm run db:backfill` | Idempotent solve/name migration |
| `npm run db:generate` | Generate Drizzle migration |
| `npm run seed` | Create or reset super admin account |

## Vercel

Set semua environment variables pada Vercel untuk `Preview` dan `Production`; `.env.local` hanya berlaku di mesin lokal. Set `BETTER_AUTH_URL=https://labs.spectrasec.xyz` dan pastikan domain tersebut ditambahkan ke Google OAuth redirect serta Better Auth trusted origins.

Vercel cocok untuk challenge berbasis file dan flag. Challenge Web/Pwn yang membutuhkan container per user harus dijalankan pada isolated runner terpisah, bukan di function Vercel.

## Security Notes

- API challenge detail tidak pernah mengembalikan `flagHash` ke player.
- UploadThing hanya menerima upload dari user terautentikasi; file challenge hanya untuk admin.
- Submission menyimpan fingerprint, bukan flag mentah.
- Jangan menjalankan `npm audit fix --force` tanpa review karena dapat menurunkan versi Next.js/UploadThing secara breaking.
