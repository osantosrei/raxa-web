const DEFAULT_AUTH_REDIRECT = "/matches";

export function getSafeRedirectPath(redirect: string | null) {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return redirect;
}

export function getInviteCodeFromRedirect(redirect: string) {
  const match = redirect.match(/^\/invite\/([^/?#]+)$/);

  return match?.[1] ? decodeURIComponent(match[1]) : null;
}
