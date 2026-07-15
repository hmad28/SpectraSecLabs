import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges, submissions, users } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { challengeId, flag } = await request.json();

  if (!challengeId || !flag) {
    return NextResponse.json(
      { error: "challengeId and flag are required" },
      { status: 400 }
    );
  }

  const challenge = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, challengeId))
    .limit(1);

  if (challenge.length === 0) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  // Check if already solved
  const alreadySolved = await db
    .select()
    .from(submissions)
    .where(
      and(
        eq(submissions.userId, session.user.id),
        eq(submissions.challengeId, challengeId),
        eq(submissions.isCorrect, true)
      )
    )
    .limit(1);

  const isCorrect = bcrypt.compareSync(flag, challenge[0].flagHash);

  // Record submission
  await db.insert(submissions).values({
    id: nanoid(),
    userId: session.user.id,
    challengeId,
    flagSubmitted: flag,
    isCorrect,
  });

  if (isCorrect && alreadySolved.length === 0) {
    // Update points & solve count
    await db
      .update(users)
      .set({
        totalPoints: sql`${users.totalPoints} + ${challenge[0].points}`,
      })
      .where(eq(users.id, session.user.id));

    await db
      .update(challenges)
      .set({
        solvedCount: sql`${challenges.solvedCount} + 1`,
      })
      .where(eq(challenges.id, challengeId));
  }

  return NextResponse.json({
    correct: isCorrect,
    alreadySolved: alreadySolved.length > 0,
    points: isCorrect && alreadySolved.length === 0 ? challenge[0].points : 0,
  });
}
