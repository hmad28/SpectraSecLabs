import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, challenges, submissions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const [userCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);
  const [challengeCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(challenges);
  const [submissionCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(submissions);
  const [solvedCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(submissions)
    .where(eq(submissions.isCorrect, true));

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link href="/" className="sidebar-brand">
          SPECTRASEC<span className="text-violet-bright">.ADMIN</span>
        </Link>
        <Link href="/admin" className="sidebar-link active">Overview</Link>
        <Link href="/admin/challenges" className="sidebar-link">Challenges</Link>
        <Link href="/admin/users" className="sidebar-link">Users</Link>
        <Link href="/admin/submissions" className="sidebar-link">Submissions</Link>
      </aside>

      <main className="dashboard-main">
        <div className="page-header">
          <h1>Admin Overview</h1>
          <p>Ringkasan aktivitas platform</p>
        </div>

        <div className="grid-4">
          <div className="stat-card">
            <p className="stat-card-value">{(userCount?.count ?? 0).toLocaleString()}</p>
            <p className="stat-card-label">Total Users</p>
          </div>
          <div className="stat-card">
            <p className="stat-card-value">{(challengeCount?.count ?? 0).toLocaleString()}</p>
            <p className="stat-card-label">Challenges</p>
          </div>
          <div className="stat-card">
            <p className="stat-card-value">{(submissionCount?.count ?? 0).toLocaleString()}</p>
            <p className="stat-card-label">Submissions</p>
          </div>
          <div className="stat-card">
            <p className="stat-card-value">{(solvedCount?.count ?? 0).toLocaleString()}</p>
            <p className="stat-card-label">Solved</p>
          </div>
        </div>
      </main>
    </div>
  );
}
