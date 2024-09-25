import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";
  const publicPath = path === "/signup" || path === "/login";

  if (!token && !publicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && publicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/", "/login", "/signup", "/profile/:path*"],
};
