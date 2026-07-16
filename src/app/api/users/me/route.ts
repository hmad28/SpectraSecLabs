import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { defaultAvatarForSeed } from "@/lib/avatars";

const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as Record<string, unknown>;
  const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
  const uploadedImage = typeof body.image === "string" && body.image.startsWith("https://") ? body.image : null;
  const image = uploadedImage ?? defaultAvatarForSeed(`${session.user.id}:${username}`);

  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json({ error: "Username harus 3-24 karakter: huruf kecil, angka, atau underscore" }, { status: 400 });
  }

  const [owner] = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
  if (owner && owner.id !== session.user.id) {
    return NextResponse.json({ error: "Username sudah dipakai" }, { status: 409 });
  }

  await db.update(users).set({ username, displayName: username, name: username, image, avatarUrl: image, updatedAt: new Date() }).where(eq(users.id, session.user.id));
  return NextResponse.json({ success: true, username });
}

export const POST = PUT;

