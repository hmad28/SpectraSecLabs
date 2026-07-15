import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET() {
  const topUsers = await db.select({
    id: users.id,
    name: users.name,
    displayName: users.displayName,
    totalPoints: users.totalPoints,
  }).from(users).orderBy(desc(users.totalPoints)).limit(100);
  return NextResponse.json(topUsers);
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
