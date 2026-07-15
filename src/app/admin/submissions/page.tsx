import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges, submissions, users } from "@/lib/db/schema";

export default async function AdminSubmissionsPage() {
  const session = await auth.api.getSession({ headers: await headers() }); if (!session || session.user.role !== "admin") redirect("/dashboard");
  const rows = await db.select({ id: submissions.id, fingerprint: submissions.submissionFingerprint, isCorrect: submissions.isCorrect, createdAt: submissions.createdAt, userName: users.name, userEmail: users.email, challengeTitle: challenges.title }).from(submissions).innerJoin(users, eq(submissions.userId, users.id)).innerJoin(challenges, eq(submissions.challengeId, challenges.id)).orderBy(desc(submissions.createdAt)).limit(200);
  return <div className="dashboard-layout"><AppSidebar admin active="/admin/submissions" /><main className="dashboard-main"><div className="page-header"><p className="eyebrow">AUDIT STREAM</p><h1>Submissions.</h1><p>200 percobaan terbaru. Input flag direpresentasikan sebagai fingerprint non-reversible.</p></div>{rows.length ? <div className="table-wrapper"><table><thead><tr><th>Player</th><th>Challenge</th><th>Fingerprint</th><th>Status</th><th>Time</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.userName || row.userEmail}</strong></td><td>{row.challengeTitle}</td><td><code>{row.fingerprint.slice(0, 16)}...</code></td><td><span className={`badge ${row.isCorrect ? "badge-green" : "badge-red"}`}>{row.isCorrect ? "CORRECT" : "WRONG"}</span></td><td>{row.createdAt.toLocaleString("id-ID")}</td></tr>)}</tbody></table></div> : <div className="empty-state"><p>Belum ada submission.</p></div>}</main></div>;
}
