import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import ChallengeForm from "../challenge-form";

export default async function EditChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const [challenge] = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, id))
    .limit(1);

  if (!challenge) notFound();

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
        <div className="page-header">
          <h1>Edit Challenge</h1>
          <p>{challenge.title}</p>
        </div>
        <ChallengeForm
          authorId={session.user.id}
          defaultValues={{
            id: challenge.id,
            title: challenge.title,
            description: challenge.description,
            category: challenge.category,
            difficulty: challenge.difficulty,
            points: challenge.points,
            flagHint: challenge.flagHint || "",
            isPublished: challenge.isPublished,
          }}
        />
      </main>
    </div>
  );
}
