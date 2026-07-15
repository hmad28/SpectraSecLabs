import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challengeFiles, challenges } from "@/lib/db/schema";
import ChallengeForm from "../challenge-form";

export default async function EditChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() }); if (!session || session.user.role !== "admin") redirect("/dashboard");
  const { id } = await params;
  const [[challenge], files] = await Promise.all([db.select().from(challenges).where(eq(challenges.id, id)).limit(1), db.select().from(challengeFiles).where(eq(challengeFiles.challengeId, id))]);
  if (!challenge) notFound();
  return <div className="dashboard-layout"><AppSidebar admin active="/admin/challenges" /><main className="dashboard-main"><div className="page-header"><p className="eyebrow">CONTENT OPS</p><h1>Edit challenge.</h1><p>{challenge.title}</p></div><ChallengeForm defaultValues={{ id: challenge.id, title: challenge.title, description: challenge.description, category: challenge.category, difficulty: challenge.difficulty, points: challenge.points, flagHint: challenge.flagHint ?? "", isPublished: challenge.isPublished, files: files.map((file) => ({ name: file.name, size: file.size, key: file.storageKey ?? file.id, url: file.url })) }} /></main></div>;
}
