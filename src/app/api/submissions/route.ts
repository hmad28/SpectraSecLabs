import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { and, count, eq, gte, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges, submissions } from "@/lib/db/schema";
import { PIONEER_BONUS, basePointsForDifficulty } from "@/lib/scoring";

const MAX_ATTEMPTS_PER_MINUTE = 10;

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  const challengeId = typeof input.challengeId === "string" ? input.challengeId : "";
  const flag = typeof input.flag === "string" ? input.flag.trim() : "";
  if (!challengeId || !flag || flag.length > 512) {
    return NextResponse.json({ error: "Challenge dan flag wajib diisi" }, { status: 400 });
  }

  const [challenge] = await db.select().from(challenges).where(eq(challenges.id, challengeId)).limit(1);
  if (!challenge || (!challenge.isPublished && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Challenge tidak ditemukan" }, { status: 404 });
  }

  const since = new Date(Date.now() - 60_000);
  const [attempts] = await db
    .select({ value: count() })
    .from(submissions)
    .where(and(eq(submissions.userId, session.user.id), gte(submissions.createdAt, since)));
  if ((attempts?.value ?? 0) >= MAX_ATTEMPTS_PER_MINUTE) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Tunggu satu menit." }, { status: 429 });
  }

  const isCorrect = await bcrypt.compare(flag, challenge.flagHash);
  const fingerprint = createHash("sha256")
    .update(`${process.env.BETTER_AUTH_SECRET ?? "labspectra"}:${flag}`)
    .digest("hex");

  if (!isCorrect) {
    await db.insert(submissions).values({
      id: nanoid(),
      userId: session.user.id,
      challengeId,
      submissionFingerprint: fingerprint,
      isCorrect: false,
    });
    return NextResponse.json({ correct: false, alreadySolved: false, points: 0 });
  }

  const submissionId = nanoid();
  const solveId = nanoid();
  const basePoints = basePointsForDifficulty(challenge.difficulty);
  const result = await db.execute<{ awarded: boolean; pioneer: boolean; points: number }>(sql`
    WITH challenge_state AS (
      SELECT id, solved_count FROM challenges WHERE id = ${challengeId} FOR UPDATE
    ), recorded_submission AS (
      INSERT INTO submissions (id, user_id, challenge_id, flag_submitted, is_correct)
      VALUES (${submissionId}, ${session.user.id}, ${challengeId}, ${fingerprint}, true)
    ), new_solve AS (
      INSERT INTO solves (id, user_id, challenge_id, points_awarded, is_pioneer)
      SELECT ${solveId}, ${session.user.id}, ${challengeId},
        ${basePoints} + CASE WHEN challenge_state.solved_count = 0 THEN ${PIONEER_BONUS} ELSE 0 END,
        challenge_state.solved_count = 0
      FROM challenge_state
      ON CONFLICT (user_id, challenge_id) DO NOTHING
      RETURNING user_id, challenge_id, points_awarded, is_pioneer
    ), update_user AS (
      UPDATE users
      SET total_points = total_points + (SELECT points_awarded FROM new_solve), updated_at = now()
      WHERE id IN (SELECT user_id FROM new_solve)
    ), update_challenge AS (
      UPDATE challenges
      SET solved_count = solved_count + 1, updated_at = now()
      WHERE id IN (SELECT challenge_id FROM new_solve)
    )
    SELECT EXISTS(SELECT 1 FROM new_solve) AS awarded,
      COALESCE((SELECT is_pioneer FROM new_solve), false) AS pioneer,
      COALESCE((SELECT points_awarded FROM new_solve), 0) AS points
  `);
  const row = result.rows[0];
  const awarded = row?.awarded === true;

  return NextResponse.json({
    correct: true,
    alreadySolved: !awarded,
    pioneer: awarded ? row?.pioneer === true : false,
    points: awarded ? Number(row?.points ?? 0) : 0,
    basePoints,
    pioneerBonus: awarded && row?.pioneer === true ? PIONEER_BONUS : 0,
  });
}

