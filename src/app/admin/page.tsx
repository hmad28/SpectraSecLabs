import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { count } from "drizzle-orm";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges, solves, submissions, users } from "@/lib/db/schema";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");
  const [[userCount], [challengeCount], [submissionCount], [solveCount]] = await Promise.all([
    db.select({ value: count() }).from(users), db.select({ value: count() }).from(challenges), db.select({ value: count() }).from(submissions), db.select({ value: count() }).from(solves),
  ]);
  const stats = [["Users", userCount?.value], ["Challenges", challengeCount?.value], ["Attempts", submissionCount?.value], ["Unique solves", solveCount?.value]];
  return <div className="dashboard-layout"><AppSidebar admin active="/admin" /><main className="dashboard-main"><div className="page-header"><p className="eyebrow">CONTROL ROOM</p><h1>Admin overview.</h1><p>Monitor platform tanpa menyentuh flag mentah atau credential user.</p></div><section className="grid-4">{stats.map(([label, value], index) => <article className="stat-card" key={label}><span className="card-index">0{index + 1}</span><p className="stat-card-value">{Number(value ?? 0).toLocaleString("id-ID")}</p><p className="stat-card-label">{label}</p></article>)}</section></main></div>;
}
