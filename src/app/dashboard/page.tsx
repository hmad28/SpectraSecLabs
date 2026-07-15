import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, submissions, challenges } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");

  const userId = session.user.id;

  // Total solved challenges
  const solvedResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(submissions)
    .where(
      and(eq(submissions.userId, userId), eq(submissions.isCorrect, true))
    );

  const solvedCount = solvedResult[0]?.count ?? 0;

  // Solved challenge details
  const solvedChallenges = await db
    .select({
      id: challenges.id,
      title: challenges.title,
      slug: challenges.slug,
      category: challenges.category,
      points: challenges.points,
    })
    .from(submissions)
    .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
    .where(
      and(eq(submissions.userId, userId), eq(submissions.isCorrect, true))
    )
    .orderBy(desc(submissions.createdAt));

  // Leaderboard rank
  const allUsers = await db
    .select({ id: users.id })
    .from(users)
    .orderBy(desc(users.totalPoints));

  const rank = allUsers.findIndex((u) => u.id === userId) + 1;

  // Total points
  const userData = await db
    .select({ totalPoints: users.totalPoints })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const totalPoints = userData[0]?.totalPoints ?? 0;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link href="/" className="sidebar-brand">
          SPECTRASEC<span className="text-violet-bright">.LABS</span>
        </Link>
        <Link href="/dashboard" className="sidebar-link active">
          Dashboard
        </Link>
        <Link href="/dashboard/settings" className="sidebar-link">
          Settings
        </Link>
        <Link href="/labs" className="sidebar-link">
          Labs
        </Link>
        <Link href="/leaderboard" className="sidebar-link">
          Leaderboard
        </Link>
        {session.user.role === "admin" && (
          <Link href="/admin" className="sidebar-link" style={{ marginTop: "auto", color: "var(--violet-bright)" }}>
            Panel Admin
          </Link>
        )}
      </aside>

      <main className="dashboard-main">
        <div className="page-header">
          <h1>{session.user.displayName || session.user.name}</h1>
          <p>{session.user.email}</p>
        </div>

        <div className="grid-3" style={{ marginBottom: 40 }}>
          <div className="stat-card">
            <p className="stat-card-value">{totalPoints}</p>
            <p className="stat-card-label">Total Poin</p>
          </div>
          <div className="stat-card">
            <p className="stat-card-value">{solvedCount}</p>
            <p className="stat-card-label">Challenge Solved</p>
          </div>
          <div className="stat-card">
            <p className="stat-card-value">
              {rank > 0 ? `#${rank}` : "-"}
            </p>
            <p className="stat-card-label">Peringkat</p>
          </div>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            margin: "0 0 16px",
          }}
        >
          Challenge Terselesaikan
        </h2>

        {solvedChallenges.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada challenge yang diselesaikan.</p>
            <Link
              href="/labs"
              className="btn btn-primary"
              style={{ marginTop: 16, display: "inline-flex" }}
            >
              Mulai Challenge
            </Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table>
              <thead>
                <tr>
                  <th>Challenge</th>
                  <th>Category</th>
                  <th style={{ width: 80, textAlign: "right" }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {solvedChallenges.map((sc) => (
                  <tr key={sc.id}>
                    <td>
                      <Link
                        href={`/labs/${sc.slug}`}
                        style={{ fontWeight: 600, textDecoration: "none", color: "inherit" }}
                      >
                        {sc.title}
                      </Link>
                    </td>
                    <td>
                      <span className="badge badge-cyan" style={{ fontSize: 10 }}>
                        {sc.category.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                      +{sc.points}
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
