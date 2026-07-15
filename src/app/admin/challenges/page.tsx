import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { AppSidebar } from "@/components/app-sidebar";
import { CategoryBadge, DifficultyBadge } from "@/components/category-badge";
import { ChallengeActions } from "@/components/challenge-actions";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";

export default async function AdminChallengesPage() {
  const session = await auth.api.getSession({ headers: await headers() }); if (!session || session.user.role !== "admin") redirect("/dashboard");
  const rows = await db.select({ id: challenges.id, title: challenges.title, category: challenges.category, difficulty: challenges.difficulty, points: challenges.points, solvedCount: challenges.solvedCount, isPublished: challenges.isPublished }).from(challenges).orderBy(desc(challenges.createdAt));
  return <div className="dashboard-layout"><AppSidebar admin active="/admin/challenges" /><main className="dashboard-main"><div className="content-heading admin-heading"><div className="page-header"><p className="eyebrow">CONTENT OPS</p><h1>Challenges.</h1></div><Link className="btn btn-primary" href="/admin/challenges/new">New Challenge +</Link></div>{rows.length ? <div className="table-wrapper"><table><thead><tr><th>Title</th><th>Track</th><th>Difficulty</th><th>Points</th><th>Solves</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.title}</strong></td><td><CategoryBadge category={row.category} /></td><td><DifficultyBadge difficulty={row.difficulty} /></td><td>{row.points}</td><td>{row.solvedCount}</td><td><span className={`badge ${row.isPublished ? "badge-green" : "badge-red"}`}>{row.isPublished ? "LIVE" : "DRAFT"}</span></td><td><ChallengeActions id={row.id} published={row.isPublished} /></td></tr>)}</tbody></table></div> : <div className="empty-state"><p>Belum ada challenge.</p></div>}</main></div>;
}
