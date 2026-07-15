import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const publicExactPages = new Set(["/", "/login", "/register", "/verify-email", "/forgot-password", "/labs", "/leaderboard"]);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPage = publicExactPages.has(pathname);
  const isPublicReadApi = request.method === "GET" && (pathname === "/api/challenges" || pathname === "/api/users");
  const isChallengeTarget = pathname.startsWith("/targets/");
  const isFrameworkRoute = pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.startsWith("/images");
  const isAuthRoute = pathname.startsWith("/api/auth");
  const isUploadRoute = pathname.startsWith("/api/uploadthing");

  if (isFrameworkRoute || isAuthRoute || isUploadRoute || isPublicReadApi || isChallengeTarget) return NextResponse.next();

  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  if (!session && isPublicPage) return NextResponse.next();
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }
  if ((pathname === "/login" || pathname === "/register") && session) {
    return NextResponse.redirect(new URL(session.user.role === "admin" ? "/admin" : "/dashboard", request.url));
  }
  if (pathname.startsWith("/admin") && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
