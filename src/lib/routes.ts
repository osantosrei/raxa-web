export const PUBLIC_PREFIXES = ["/login", "/register", "/invite"];
export const CHROMELESS_PREFIXES = PUBLIC_PREFIXES;

export function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some((route) => pathname.startsWith(route));
}
