import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-line p-6 space-y-1">
        <Link
          href="/"
          className="font-display font-bold text-lg block mb-8"
        >
          SPECTRASEC<span className="text-violet-bright">.LABS</span>
        </Link>
        <Link
          href="/dashboard"
          className="block px-4 py-2 rounded-lg bg-panel-2 text-sm font-medium"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/settings"
          className="block px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
        >
          Settings
        </Link>
        <Link
          href="/labs"
          className="block px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
        >
          Labs
        </Link>
        <Link
          href="/leaderboard"
          className="block px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
        >
          Leaderboard
        </Link>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold font-display mb-1">
          {session.user.displayName || session.user.name}
        </h1>
        <p className="text-muted text-sm mb-8">{session.user.email}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-panel border border-line rounded-xl p-6">
            <p className="text-2xl font-bold font-display">
              {session.user.totalPoints ?? 0}
            </p>
            <p className="text-muted text-sm mt-1">Total Poin</p>
          </div>
          <div className="bg-panel border border-line rounded-xl p-6">
            <p className="text-2xl font-bold font-display">0</p>
            <p className="text-muted text-sm mt-1">Challenge Solved</p>
          </div>
          <div className="bg-panel border border-line rounded-xl p-6">
            <p className="text-2xl font-bold font-display">-</p>
            <p className="text-muted text-sm mt-1">Peringkat</p>
          </div>
        </div>

        <div className="bg-panel border border-line rounded-xl p-8 text-center">
          <p className="text-muted">
            Belum ada challenge yang diselesaikan.
          </p>
          <Link
            href="/labs"
            className="inline-block mt-4 px-6 py-2 rounded-lg bg-violet text-white text-sm font-semibold hover:bg-violet-bright transition-colors"
          >
            Mulai Challenge
          </Link>
        </div>
      </main>
    </div>
  );
}
