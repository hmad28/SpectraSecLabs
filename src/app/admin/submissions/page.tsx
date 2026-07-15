import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, challenges, submissions } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function AdminSubmissionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const allSubmissions = await db
    .select({
      id: submissions.id,
      flagSubmitted: submissions.flagSubmitted,
      isCorrect: submissions.isCorrect,
      createdAt: submissions.createdAt,
      userName: users.displayName,
      userEmail: users.email,
      challengeTitle: challenges.title,
    })
    .from(submissions)
    .innerJoin(users, eq(submissions.userId, users.id))
    .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
    .orderBy(desc(submissions.createdAt))
    .limit(200);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link href="/" className="sidebar-brand">
          SPECTRASEC<span className="text-violet-bright">.ADMIN</span>
        </Link>
        <Link href="/admin" className="sidebar-link">Overview</Link>
        <Link href="/admin/challenges" className="sidebar-link">Challenges</Link>
        <Link href="/admin/users" className="sidebar-link">Users</Link>
        <Link href="/admin/submissions" className="sidebar-link active">Submissions</Link>
      </aside>

      <main className="dashboard-main">
        <div className="page-header">
          <h1>Submissions</h1>
          <p>Log submission pemain (200 terbaru)</p>
        </div>

        {allSubmissions.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada submission.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Challenge</th>
                  <th>Flag</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {allSubmissions.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>
                      {s.userName || s.userEmail}
                    </td>
                    <td>{s.challengeTitle}</td>
                    <td>
                      <code
                        style={{
                          fontSize: 12,
                          background: "rgba(255,255,255,.05)",
                          padding: "2px 6px",
                          borderRadius: 4,
                          color: "var(--muted)",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "inline-block",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.flagSubmitted}
                      </code>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          s.isCorrect ? "badge-green" : "badge-red"
                        }`}
                        style={{ fontSize: 10 }}
                      >
                        {s.isCorrect ? "Correct" : "Wrong"}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--muted)" }}>
                      {new Date(s.createdAt).toLocaleString("id-ID")}
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
