import axios from "axios";
import Cookies from "js-cookie";

import { API_WAKING_MESSAGE } from "@/api/health";
import { TOKEN_KEY } from "@/lib/auth";
import type { ApiError } from "@/types/api";

const PUBLIC_REQUEST_PATTERNS = [
  /^\/health$/,
  /^\/auth\/login$/,
  /^\/auth\/register$/,
  /^\/invites\/[^/]+\/resolve$/,
];

/**
 * Determine whether a request URL corresponds to a public (no-auth) endpoint.
 *
 * @param url - The request URL or path; the query string (after `?`) is ignored.
 * @returns `true` if the path portion of `url` matches any configured public request pattern, `false` otherwise.
 */
function isPublicRequest(url?: string) {
  const pathname = url?.split("?")[0];

  return PUBLIC_REQUEST_PATTERNS.some((pattern) => pattern.test(pathname ?? ""));
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY);

  if (token && !isPublicRequest(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response?.data as ApiError | undefined;
    const requestUrl = error.config?.url as string | undefined;
    const isPublicRequestError = isPublicRequest(requestUrl);

    if (error.response?.status === 401 && !isPublicRequestError) {
      Cookies.remove(TOKEN_KEY);

      if (typeof window !== "undefined") {
        const currentPath = `${window.location.pathname}${window.location.search}`;
        const redirect = encodeURIComponent(currentPath);

        window.localStorage.removeItem("raxa_user");
        window.location.href = `/login?redirect=${redirect}`;
      }
    }

    return Promise.reject(
      apiError ?? {
        message: API_WAKING_MESSAGE,
        isConnectionError: true,
      },
    );
  },
);
