# SpectraSec Labs

Platform CTF untuk komunitas cyber security SpectraSec. Labs memakai Next.js App Router, Neon Postgres, Better Auth, UploadThing, dan Vercel serverless.

## Fitur

- Landing page dan visual system cyber-research yang konsisten dengan SpectraSec.
- Challenge archive dengan filter kategori, difficulty, publish/unpublish, dan file artefak.
- Auth email/password dan Google OAuth melalui Better Auth.
- Verification OTP, password reset OTP, set/change password di dashboard, dan reset flow publik.
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
RESEND_API_KEY
RESEND_FROM_EMAIL
SUPER_ADMIN_EMAIL
SUPER_ADMIN_PASSWORD
GOOGLE_CLIENT_ID       # optional
GOOGLE_CLIENT_SECRET   # optional
```

`.env.local` tidak boleh dikomit. Token yang pernah dibagikan di luar secret manager harus di-rotate sebelum production.
