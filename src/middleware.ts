import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicRoute =
    path === "/login" || path === "/signup" || path === "/verify";
  const token = request.cookies.get("token")?.value || "";

  if (!publicRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (publicRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/", "/profile/:path*", "/login", "/signup", "/verify"],
};
