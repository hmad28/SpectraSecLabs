import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, submissions, challenges } from "@/lib/db/schema";
import { desc, eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const topUsers = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      totalPoints: users.totalPoints,
    })
    .from(users)
    .orderBy(desc(users.totalPoints))
    .limit(100);

  return NextResponse.json(topUsers);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers as Headers,
  });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, role } = await request.json();

  if (!userId || !role) {
    return NextResponse.json(
      { error: "userId and role are required" },
      { status: 400 }
    );
  }

  // Prevent modifying super admin (by email)
  const targetUser = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (
    targetUser.length > 0 &&
    targetUser[0].email === process.env.SUPER_ADMIN_EMAIL
  ) {
    return NextResponse.json(
      { error: "Cannot modify super admin" },
      { status: 403 }
    );
  }

  await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId));

  return NextResponse.json({ success: true });
}
