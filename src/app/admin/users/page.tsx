import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      displayName: users.displayName,
      role: users.role,
      totalPoints: users.totalPoints,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@spectrasec.id";

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link href="/" className="sidebar-brand">
          SPECTRASEC<span className="text-violet-bright">.ADMIN</span>
        </Link>
        <Link href="/admin" className="sidebar-link">Overview</Link>
        <Link href="/admin/challenges" className="sidebar-link">Challenges</Link>
        <Link href="/admin/users" className="sidebar-link active">Users</Link>
        <Link href="/admin/submissions" className="sidebar-link">Submissions</Link>
      </aside>

      <main className="dashboard-main">
        <div className="page-header">
          <h1>Users</h1>
          <p>{allUsers.length} total users</p>
        </div>

        {allUsers.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada user terdaftar.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Points</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>
                      {u.displayName || u.username}
                      {u.email === superAdminEmail && (
                        <span
                          className="badge badge-red"
                          style={{ marginLeft: 8, fontSize: 9 }}
                        >
                          SUPER ADMIN
                        </span>
                      )}
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>
                      {u.email}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === "admin" ? "badge-violet" : "badge-cyan"
                        }`}
                        style={{ fontSize: 10 }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>
                      {u.totalPoints}
                    </td>
                    <td style={{ fontSize: 13, color: "var(--muted)" }}>
                      {new Date(u.createdAt).toLocaleDateString("id-ID")}
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
