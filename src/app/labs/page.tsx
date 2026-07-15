import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

const categoryColors: Record<string, string> = {
  web: "badge-cyan",
  crypto: "badge-violet",
  forensic: "badge-yellow",
  osint: "badge-green",
  reversing: "badge-red",
  pwn: "badge-red",
  misc: "badge-violet",
};

export default async function LabsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  }).catch(() => null);

  const allChallenges = await db
    .select({
      id: challenges.id,
      title: challenges.title,
      slug: challenges.slug,
      category: challenges.category,
      difficulty: challenges.difficulty,
      points: challenges.points,
      solvedCount: challenges.solvedCount,
    })
    .from(challenges)
    .where(eq(challenges.isPublished, true))
    .orderBy(desc(challenges.createdAt));

  return (
    <div>
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          SPECTRASEC<span className="text-violet-bright">.LABS</span>
        </Link>
        <div className="navbar-links">
          <Link href="/labs" className="navbar-link" style={{ color: "var(--paper)" }}>Labs</Link>
          <Link href="/leaderboard" className="navbar-link">Leaderboard</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="navbar-link">Dashboard</Link>
              <Link href="/labs" className="btn btn-primary" style={{ minHeight: 36, padding: "0 16px", fontSize: 13 }}>
                {session.user.displayName || session.user.name}
              </Link>
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
          <h1>Labs</h1>
          <p>Jelajahi dan selesaikan tantangan CTF</p>
        </div>

        {allChallenges.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada challenge yang dipublikasikan.</p>
            {session?.user.role === "admin" && (
              <Link href="/admin/challenges/new" className="btn btn-primary" style={{ marginTop: 16, display: "inline-flex" }}>
                Buat Challenge
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {allChallenges.map((c) => (
              <Link
                key={c.id}
                href={`/labs/${c.slug}`}
                className="card category-card"
                style={{ padding: 24, textDecoration: "none" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <span className={`badge ${categoryColors[c.category] || "badge-violet"}`}>
                    {c.category.toUpperCase()}
                  </span>
                  <span className={`badge ${c.difficulty === "easy" ? "badge-green" : c.difficulty === "medium" ? "badge-yellow" : c.difficulty === "hard" ? "badge-red" : "badge-violet"}`}>
                    {c.difficulty}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
                  {c.title}
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--line)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--violet-bright)", fontWeight: 700 }}>
                    {c.points} pts
                  </span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>
                    {c.solvedCount} solved
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
