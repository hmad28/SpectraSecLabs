import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

const publicPaths = ["/login", "/register", "/labs", "/leaderboard", "/"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isUploadRoute = pathname.startsWith("/api/uploadthing");
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images");

  if (isStatic || isApiAuthRoute || isUploadRoute) {
    return NextResponse.next();
  }

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session && isPublic) {
      return NextResponse.next();
    }

    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    if (!isPublic) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
