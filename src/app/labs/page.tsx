import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LabsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-line">
        <Link href="/" className="font-display font-bold text-lg">
          SPECTRASEC<span className="text-violet-bright">.LABS</span>
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/labs"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Labs
              </Link>
              <Link
                href="/leaderboard"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Leaderboard
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-muted hover:text-foreground">
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-violet text-white text-sm font-semibold hover:bg-violet-bright transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-display">Labs</h1>
          <p className="text-muted mt-2">
            Jelajahi dan selesaikan tantangan CTF
          </p>
        </div>

        <div className="bg-panel border border-line rounded-xl p-12 text-center">
          <p className="text-muted mb-4">
            Belum ada challenge yang dipublikasikan.
          </p>
          <p className="text-sm text-muted">
            Admin akan segera menambahkan challenge pertama.
          </p>
        </div>
      </main>
    </div>
  );
}
