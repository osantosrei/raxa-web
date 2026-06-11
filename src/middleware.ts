import { NextResponse, type NextRequest } from "next/server";

import { TOKEN_KEY } from "@/lib/auth";

const PUBLIC_ROUTES = ["/login", "/register", "/invite"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value;
  const pathname = request.nextUrl.pathname;
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (!token && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/matches", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)"],
};
