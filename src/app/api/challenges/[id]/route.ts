import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [challenge] = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, id))
    .limit(1);

  if (!challenge) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(challenge);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.delete(challenges).where(eq(challenges.id, id));
  return NextResponse.json({ success: true });
}
