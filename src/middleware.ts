import { NextResponse, type NextRequest } from "next/server";

import { TOKEN_KEY } from "@/lib/auth";

const PUBLIC_ROUTES = ["/login", "/register", "/invite"];

/**
 * Enforces authentication redirects for incoming requests.
 *
 * Checks the presence of an authentication token in cookies and the requested path.
 * - If the user is unauthenticated and requests a non-public route, redirects to `/login`
 *   and includes the original pathname in the `redirect` query parameter.
 * - If the user is authenticated and requests `/login` or `/register`, redirects to `/matches`.
 * - Otherwise allows the request to continue.
 *
 * @param request - The incoming Next.js request used to read cookies and pathname
 * @returns A NextResponse that redirects to `/login` or `/matches`, or allows the request to continue
 */
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
