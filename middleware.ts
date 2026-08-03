import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, readSessionToken } from "@/lib/admin/session";

const LOGIN_PATH = "/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === LOGIN_PATH) {
    if (!session) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (session) return NextResponse.next();

  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
