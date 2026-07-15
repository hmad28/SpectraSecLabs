import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const publicPages = ["/login", "/register", "/labs", "/leaderboard", "/"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPage = publicPages.some((path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)));
  const isPublicReadApi = request.method === "GET" && (pathname === "/api/challenges" || pathname === "/api/users");
  const isFrameworkRoute = pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.startsWith("/images");
  const isAuthRoute = pathname.startsWith("/api/auth");
  const isUploadRoute = pathname.startsWith("/api/uploadthing");

  if (isFrameworkRoute || isAuthRoute || isUploadRoute || isPublicReadApi) return NextResponse.next();

  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  if (!session && isPublicPage) return NextResponse.next();
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }
  if (pathname.startsWith("/admin") && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
