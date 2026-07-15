import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  let query = db
    .select({
      id: challenges.id,
      title: challenges.title,
      slug: challenges.slug,
      category: challenges.category,
      difficulty: challenges.difficulty,
      points: challenges.points,
      solvedCount: challenges.solvedCount,
    })
    .from(challenges)
    .where(eq(challenges.isPublished, true))
    .orderBy(desc(challenges.createdAt));

  const results = await query;
  let filtered = results;

  if (category) filtered = filtered.filter((c) => c.category === category);
  if (difficulty) filtered = filtered.filter((c) => c.difficulty === difficulty);

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, category, difficulty, points, flag, flagHint, isPublished, authorId } =
    await request.json();

  if (!title || !description || !category || !difficulty || !points || !flag) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const flagHash = await bcrypt.hash(flag, 10);

  const id = nanoid();

  await db.insert(challenges).values({
    id,
    title,
    slug: `${slug}-${id.slice(0, 6)}`,
    description,
    category,
    difficulty,
    points: parseInt(points),
    flagHash,
    flagHint: flagHint || null,
    authorId: authorId || session.user.id,
    isPublished: isPublished === true,
  });

  return NextResponse.json({ id, slug });
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, description, category, difficulty, points, flag, flagHint, isPublished } =
    await request.json();

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    title,
    description,
    category,
    difficulty,
    points: parseInt(points),
    flagHint: flagHint || null,
    isPublished: isPublished === true,
  };

  if (flag) {
    updates.flagHash = await bcrypt.hash(flag, 10);
  }

  await db.update(challenges).set(updates).where(eq(challenges.id, id));

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  await db.delete(challenges).where(eq(challenges.id, id));

  return NextResponse.json({ success: true });
}
