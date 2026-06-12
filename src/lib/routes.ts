export const PUBLIC_PREFIXES = [
  "/login",
  "/register",
  "/invite",
  "/team-draw-preview",
];
export const CHROMELESS_PREFIXES = ["/login", "/register", "/invite"];

export function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some((route) => pathname.startsWith(route));
}
