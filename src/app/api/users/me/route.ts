import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const image = typeof body.image === "string" && body.image.startsWith("https://") ? body.image : null;
  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Nama harus 2-80 karakter" }, { status: 400 });
  }
  await db.update(users).set({ name, displayName: name, image, avatarUrl: image, updatedAt: new Date() }).where(eq(users.id, session.user.id));
  return NextResponse.json({ success: true });
}
