import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

async function forwardEmailOtp(request: Request, path: string, body: Record<string, unknown>) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const response = await fetch(new URL(path, request.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: requestHeaders.get("cookie") ?? "",
    },
    body: JSON.stringify({ ...body, email: session.user.email }),
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: Request) {
  return forwardEmailOtp(request, "/api/auth/email-otp/send-verification-otp", { type: "email-verification" });
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";
  if (!otp) return NextResponse.json({ error: "OTP wajib diisi" }, { status: 400 });
  return forwardEmailOtp(request, "/api/auth/email-otp/verify-email", { otp });
}
