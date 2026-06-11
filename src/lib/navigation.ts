const DEFAULT_AUTH_REDIRECT = "/matches";

export function getSafeRedirectPath(redirect: string | null) {
  if (
    !redirect ||
    !redirect.startsWith("/") ||
    redirect.startsWith("//") ||
    /\\|%5c/i.test(redirect)
  ) {
    return DEFAULT_AUTH_REDIRECT;
  }

  try {
    const decodedRedirect = decodeURIComponent(redirect);

    if (
      !decodedRedirect.startsWith("/") ||
      decodedRedirect.startsWith("//") ||
      decodedRedirect.includes("\\")
    ) {
      return DEFAULT_AUTH_REDIRECT;
    }

    return decodedRedirect;
  } catch {
    return DEFAULT_AUTH_REDIRECT;
  }
}

export function getInviteCodeFromRedirect(redirect: string) {
  const match = redirect.match(/^\/invite\/([^/?#]+)$/);

  if (!match?.[1]) {
    return null;
  }

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
