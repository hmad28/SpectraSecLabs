import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challengeFiles, challenges } from "@/lib/db/schema";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.role === "admin" ? session : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const [challenge] = await db.select({
    id: challenges.id,
    title: challenges.title,
    slug: challenges.slug,
    description: challenges.description,
    category: challenges.category,
    difficulty: challenges.difficulty,
    points: challenges.points,
    flagHint: challenges.flagHint,
    isPublished: challenges.isPublished,
  }).from(challenges).where(eq(challenges.id, id)).limit(1);
  if (!challenge) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const files = await db.select().from(challengeFiles).where(eq(challengeFiles.challengeId, id));
  return NextResponse.json({ ...challenge, files });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const deleted = await db.delete(challenges).where(eq(challenges.id, id)).returning({ id: challenges.id });
  return deleted.length
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
