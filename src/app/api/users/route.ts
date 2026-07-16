import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { avatarForUser } from "@/lib/avatars";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { playerHandle } from "@/lib/privacy";
import { bestBadge } from "@/lib/scoring";

type PublicScoreRow = {
  id: string;
  username: string | null;
  displayName: string | null;
  email: string;
  image: string | null;
  avatarUrl: string | null;
  totalPoints: number;
  solves: number;
  pioneers: number;
  easy: number;
  medium: number;
  hard: number;
  insane: number;
  categories: number;
};

export async function GET() {
  const result = await db.execute<PublicScoreRow>(sql`
    SELECT u.id, u.username, u.display_name AS "displayName", u.email, u.image, u.avatar_url AS "avatarUrl", u.total_points AS "totalPoints",
      COUNT(s.id)::int AS solves,
      COUNT(s.id) FILTER (WHERE s.is_pioneer = true)::int AS pioneers,
      COUNT(s.id) FILTER (WHERE c.difficulty = 'easy')::int AS easy,
      COUNT(s.id) FILTER (WHERE c.difficulty = 'medium')::int AS medium,
      COUNT(s.id) FILTER (WHERE c.difficulty = 'hard')::int AS hard,
      COUNT(s.id) FILTER (WHERE c.difficulty = 'insane')::int AS insane,
      COUNT(DISTINCT c.category)::int AS categories
    FROM users u
    LEFT JOIN solves s ON s.user_id = u.id
    LEFT JOIN challenges c ON c.id = s.challenge_id
    WHERE u.total_points > 0
    GROUP BY u.id, u.username, u.display_name, u.email, u.image, u.avatar_url, u.total_points, u.updated_at
    ORDER BY u.total_points DESC, u.updated_at ASC
    LIMIT 100
  `);
  return NextResponse.json(result.rows.map((user, index) => {
    const badge = bestBadge({ easy: Number(user.easy), medium: Number(user.medium), hard: Number(user.hard), insane: Number(user.insane), pioneers: Number(user.pioneers), categories: Number(user.categories), categoryTotal: 8 });
    return { rank: index + 1, id: user.id, handle: playerHandle(user, user.email), avatar: avatarForUser(user), totalPoints: Number(user.totalPoints), solves: Number(user.solves), pioneers: Number(user.pioneers), bestBadge: badge?.label ?? null };
  }));
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json() as Record<string, unknown>;
  const userId = typeof body.userId === "string" ? body.userId : "";
  const role = body.role === "admin" || body.role === "user" ? body.role : null;
  if (!userId || !role) return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
  if (userId === session.user.id && role !== "admin") {
    return NextResponse.json({ error: "Admin tidak dapat menurunkan rolenya sendiri" }, { status: 403 });
  }
  const [target] = await db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
  if (!target) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  if (target.email === process.env.SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Super admin tidak dapat diubah" }, { status: 403 });
  }
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));
  return NextResponse.json({ success: true });
}
