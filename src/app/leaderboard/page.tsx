import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, submissions } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export default async function LeaderboardPage() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  const topUsers = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      totalPoints: users.totalPoints,
    })
    .from(users)
    .where(sql`${users.totalPoints} > 0`)
    .orderBy(desc(users.totalPoints))
    .limit(100);

  return (
    <div>
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          SPECTRASEC<span className="text-violet-bright">.LABS</span>
        </Link>
        <div className="navbar-links">
          <Link href="/labs" className="navbar-link">Labs</Link>
          <Link href="/leaderboard" className="navbar-link" style={{ color: "var(--paper)" }}>Leaderboard</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="navbar-link">Dashboard</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="navbar-link">Masuk</Link>
              <Link href="/register" className="btn btn-primary" style={{ minHeight: 36, padding: "0 16px", fontSize: 13 }}>Daftar</Link>
            </>
          )}
        </div>
      </nav>

      <main className="container" style={{ paddingBlock: "48px 80px" }}>
        <div className="page-header">
          <h1>Leaderboard</h1>
          <p>Peringkat pemain berdasarkan total poin</p>
        </div>

        {topUsers.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada data leaderboard. Selesaikan challenge pertama!</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Rank</th>
                  <th>Player</th>
                  <th style={{ width: 120, textAlign: "right" }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((u, i) => (
                  <tr key={u.id}>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 800,
                          fontSize: 14,
                          color:
                            i === 0
                              ? "var(--yellow)"
                              : i === 1
                              ? "var(--muted)"
                              : i === 2
                              ? "var(--red)"
                              : "var(--muted)",
                        }}
                      >
                        #{i + 1}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>
                        {u.displayName || u.username}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          color: "var(--violet-bright)",
                        }}
                      >
                        {u.totalPoints}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
