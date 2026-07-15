import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function LeaderboardPage() {
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
                className="text-sm text-cyan hover:text-cyan transition-colors"
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

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-display">Leaderboard</h1>
          <p className="text-muted mt-2">
            Peringkat berdasarkan total poin
          </p>
        </div>

        <div className="bg-panel border border-line rounded-xl p-12 text-center">
          <p className="text-muted mb-4">
            Belum ada data leaderboard.
          </p>
          <p className="text-sm text-muted">
            Selesaikan challenge pertama untuk muncul di papan peringkat.
          </p>
        </div>
      </main>
    </div>
  );
}
