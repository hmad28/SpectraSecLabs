import { headers } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challengeFiles, challenges } from "@/lib/db/schema";
import { challengeCategories, challengeDifficulties, parseChallengeInput } from "@/lib/validation";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.role === "admin" ? session : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");
  const conditions = [eq(challenges.isPublished, true)];
  if (category && challengeCategories.includes(category as never)) conditions.push(eq(challenges.category, category as never));
  if (difficulty && challengeDifficulties.includes(difficulty as never)) conditions.push(eq(challenges.difficulty, difficulty as never));

  const results = await db.select({
    id: challenges.id,
    title: challenges.title,
    slug: challenges.slug,
    category: challenges.category,
    difficulty: challenges.difficulty,
    points: challenges.points,
    solvedCount: challenges.solvedCount,
  }).from(challenges).where(and(...conditions)).orderBy(desc(challenges.createdAt));
  return NextResponse.json(results);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const input = parseChallengeInput(await request.json(), true);
    const id = nanoid();
    const baseSlug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "challenge";
    const slug = `${baseSlug}-${id.slice(0, 6)}`;
    await db.insert(challenges).values({
      id,
      title: input.title,
      slug,
      description: input.description,
      category: input.category,
      difficulty: input.difficulty,
      points: input.points,
      flagHash: await bcrypt.hash(input.flag, 12),
      flagHint: input.flagHint,
      authorId: session.user.id,
      isPublished: input.isPublished,
    });
    if (input.files.length) {
      await db.insert(challengeFiles).values(input.files.map((file) => ({
        id: nanoid(), challengeId: id, name: file.name, storageKey: file.key, url: file.url, size: file.size,
      })));
    }
    return NextResponse.json({ id, slug }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal membuat challenge" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) throw new Error("ID challenge wajib diisi");
    const input = parseChallengeInput(body, false);
    const updates = {
      title: input.title,
      description: input.description,
      category: input.category,
      difficulty: input.difficulty,
      points: input.points,
      flagHint: input.flagHint,
      isPublished: input.isPublished,
      updatedAt: new Date(),
      ...(input.flag ? { flagHash: await bcrypt.hash(input.flag, 12) } : {}),
    };
    const updated = await db.update(challenges).set(updates).where(eq(challenges.id, id)).returning({ id: challenges.id });
    if (!updated.length) return NextResponse.json({ error: "Challenge tidak ditemukan" }, { status: 404 });
    await db.delete(challengeFiles).where(eq(challengeFiles.challengeId, id));
    if (input.files.length) {
      await db.insert(challengeFiles).values(input.files.map((file) => ({
        id: nanoid(), challengeId: id, name: file.name, storageKey: file.key, url: file.url, size: file.size,
      })));
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memperbarui challenge" }, { status: 400 });
  }
}
