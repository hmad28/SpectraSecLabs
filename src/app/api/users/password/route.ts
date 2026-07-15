import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null) as { currentPassword?: string; newPassword?: string } | null;
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  if (newPassword.length < 8) return NextResponse.json({ error: "Password minimal 8 karakter" }, { status: 400 });
  if (newPassword.length > 128) return NextResponse.json({ error: "Password maksimal 128 karakter" }, { status: 400 });

  const existingAccounts = await db.select().from(accounts).where(eq(accounts.userId, session.user.id));
  const credential = existingAccounts.find((account) => account.providerId === "credential" && account.password);
  const passwordHash = await hashPassword(newPassword);
  const now = new Date();

  if (!credential) {
    await db.insert(accounts).values({
      id: nanoid(),
      userId: session.user.id,
      accountId: session.user.id,
      providerId: "credential",
      password: passwordHash,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ success: true, mode: "set" });
  }

  if (!currentPassword) return NextResponse.json({ error: "Password saat ini wajib diisi" }, { status: 400 });
  const valid = await verifyPassword({ hash: credential.password!, password: currentPassword });
  if (!valid) return NextResponse.json({ error: "Password saat ini salah" }, { status: 400 });

  await db.update(accounts).set({ password: passwordHash, updatedAt: now }).where(eq(accounts.id, credential.id));
  return NextResponse.json({ success: true, mode: "changed" });
}
