import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { count, desc, eq, gt } from "drizzle-orm";
import { AppSidebar } from "@/components/app-sidebar";
import { CategoryBadge } from "@/components/category-badge";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges, solves, users } from "@/lib/db/schema";
import { playerHandle, shortEmailFingerprint } from "@/lib/privacy";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userId = session.user.id;
  const [[user], solvedChallenges] = await Promise.all([
    db.select({ totalPoints: users.totalPoints, username: users.username, displayName: users.displayName, email: users.email }).from(users).where(eq(users.id, userId)).limit(1),
    db.select({ id: challenges.id, title: challenges.title, slug: challenges.slug, category: challenges.category, points: solves.pointsAwarded, createdAt: solves.createdAt })
      .from(solves).innerJoin(challenges, eq(solves.challengeId, challenges.id)).where(eq(solves.userId, userId)).orderBy(desc(solves.createdAt)),
  ]);
  const [higherRanked] = await db.select({ value: count() }).from(users).where(gt(users.totalPoints, user?.totalPoints ?? 0));
  const emailHash = shortEmailFingerprint(user?.email ?? session.user.email);
  return <div className="dashboard-layout">
    <AppSidebar active="/dashboard" />
    <main className="dashboard-main">
      <div className="page-header"><p className="eyebrow">PLAYER OVERVIEW</p><h1>{playerHandle(user ?? {}, user?.email ?? session.user.email)}</h1><p>Email hash: <code>{emailHash}</code></p></div>
      <section className="grid-3 dashboard-stats"><article className="stat-card"><span className="card-index">01</span><p className="stat-card-value">{user?.totalPoints ?? 0}</p><p className="stat-card-label">Total points</p></article><article className="stat-card"><span className="card-index">02</span><p className="stat-card-value">{solvedChallenges.length}</p><p className="stat-card-label">Verified solves</p></article><article className="stat-card"><span className="card-index">03</span><p className="stat-card-value">#{(higherRanked?.value ?? 0) + 1}</p><p className="stat-card-label">Community rank</p></article></section>
      <div className="content-heading"><h2>Recent solves</h2><Link href="/labs">Cari challenge →</Link></div>
      {solvedChallenges.length ? <div className="table-wrapper"><table><thead><tr><th>Challenge</th><th>Category</th><th>Solved at</th><th>Points</th></tr></thead><tbody>{solvedChallenges.map((solve) => <tr key={solve.id}><td><Link href={`/labs/${solve.slug}`}><strong>{solve.title}</strong></Link></td><td><CategoryBadge category={solve.category} /></td><td>{solve.createdAt.toLocaleDateString("id-ID")}</td><td><strong className="points">+{solve.points}</strong></td></tr>)}</tbody></table></div> : <div className="empty-state"><p>Belum ada challenge yang diselesaikan.</p><Link href="/labs" className="btn btn-primary empty-action">Mulai Challenge</Link></div>}
      {session.user.role === "admin" ? <Link href="/admin" className="admin-callout"><span>ADMIN ACCESS</span><strong>Buka control room →</strong></Link> : null}
    </main>
  </div>;
}

