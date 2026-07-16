import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { AppSidebar } from "@/components/app-sidebar";
import { UserRoleControl } from "@/components/user-role-control";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { playerHandle, shortEmailFingerprint } from "@/lib/privacy";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() }); if (!session || session.user.role !== "admin") redirect("/dashboard");
  const rows = await db.select({ id: users.id, username: users.username, displayName: users.displayName, email: users.email, role: users.role, totalPoints: users.totalPoints, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt));
  return <div className="dashboard-layout"><AppSidebar admin active="/admin/users" /><main className="dashboard-main"><div className="page-header"><p className="eyebrow">ACCESS CONTROL</p><h1>Users.</h1><p>{rows.length} akun terdaftar. Identitas ditampilkan sebagai handle dan fingerprint email.</p></div>{rows.length ? <div className="table-wrapper"><table><thead><tr><th>Identity</th><th>Email Hash</th><th>Points</th><th>Joined</th><th>Role</th></tr></thead><tbody>{rows.map((user) => { const locked = user.id === session.user.id || user.email === process.env.SUPER_ADMIN_EMAIL; return <tr key={user.id}><td><strong>{playerHandle(user, user.email)}</strong></td><td><code>{shortEmailFingerprint(user.email)}</code></td><td><strong className="points">{user.totalPoints}</strong></td><td>{user.createdAt.toLocaleDateString("id-ID")}</td><td><UserRoleControl userId={user.id} role={user.role} disabled={locked} /></td></tr>; })}</tbody></table></div> : <div className="empty-state"><p>Belum ada user.</p></div>}</main></div>;
}
