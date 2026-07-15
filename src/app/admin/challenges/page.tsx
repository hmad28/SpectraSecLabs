import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function AdminChallengesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const allChallenges = await db
    .select()
    .from(challenges)
    .orderBy(desc(challenges.createdAt));

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link href="/" className="sidebar-brand">
          SPECTRASEC<span className="text-violet-bright">.ADMIN</span>
        </Link>
        <Link href="/admin" className="sidebar-link">Overview</Link>
        <Link href="/admin/challenges" className="sidebar-link active">Challenges</Link>
        <Link href="/admin/users" className="sidebar-link">Users</Link>
        <Link href="/admin/submissions" className="sidebar-link">Submissions</Link>
      </aside>

      <main className="dashboard-main">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div className="page-header" style={{ margin: 0 }}>
            <h1>Challenges</h1>
          </div>
          <Link href="/admin/challenges/new" className="btn btn-primary" style={{ minHeight: 40 }}>
            + New Challenge
          </Link>
        </div>

        {allChallenges.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada challenge. Buat challenge pertama!</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Points</th>
                  <th>Solved</th>
                  <th>Published</th>
                  <th style={{ width: 80 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {allChallenges.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td>
                      <span className="badge badge-cyan" style={{ fontSize: 10 }}>
                        {c.category.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          c.difficulty === "easy"
                            ? "badge-green"
                            : c.difficulty === "medium"
                            ? "badge-yellow"
                            : c.difficulty === "hard"
                            ? "badge-red"
                            : "badge-violet"
                        }`}
                        style={{ fontSize: 10 }}
                      >
                        {c.difficulty}
                      </span>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{c.points}</td>
                    <td>{c.solvedCount}</td>
                    <td>
                      <span
                        className={`badge ${c.isPublished ? "badge-green" : "badge-red"}`}
                        style={{ fontSize: 10 }}
                      >
                        {c.isPublished ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/challenges/${c.id}`}
                        className="badge badge-violet"
                        style={{ textDecoration: "none", fontSize: 10 }}
                      >
                        Edit
                      </Link>
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
