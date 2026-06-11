import axios from "axios";
import Cookies from "js-cookie";

import { TOKEN_KEY } from "@/lib/auth";
import type { ApiError } from "@/types/api";

const PUBLIC_AUTH_PATHS = ["/auth/login", "/auth/register"];

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response?.data as ApiError | undefined;
    const requestUrl = error.config?.url as string | undefined;
    const isPublicAuthRequest = PUBLIC_AUTH_PATHS.some((path) =>
      requestUrl?.endsWith(path),
    );

    if (error.response?.status === 401 && !isPublicAuthRequest) {
      Cookies.remove(TOKEN_KEY);

      if (typeof window !== "undefined") {
        window.localStorage.removeItem("raxa_user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(apiError ?? { message: "Sem conexão com o servidor." });
  },
);
