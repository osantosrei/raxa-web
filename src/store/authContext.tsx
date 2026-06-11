"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { TOKEN_KEY } from "@/lib/auth";
import type { AuthResponse, UserResponse } from "@/types/api";

interface AuthState {
  user: UserResponse | null;
  isLoading: boolean;
  signIn: (response: AuthResponse) => void;
  signOut: () => void;
  updateUser: (user: UserResponse) => void;
}

const AuthContext = createContext<AuthState | null>(null);
const USER_STORAGE_KEY = "raxa_user";

/**
 * Provides authentication context (current user, loading state, and auth actions) to descendant components.
 *
 * Initializes user state from a persisted token and localStorage, and exposes `signIn`, `signOut`, and `updateUser` through context.
 *
 * @param children - React nodes rendered inside the provider
 * @returns The AuthContext provider element wrapping `children`
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const clearAuthState = useCallback(() => {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);

    if (!token) {
      clearAuthState();
      setIsLoading(false);
      return;
    }

    if (!storedUser) {
      Cookies.remove(TOKEN_KEY);
      setIsLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(storedUser) as UserResponse);
    } catch {
      Cookies.remove(TOKEN_KEY);
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }

    setIsLoading(false);
  }, [clearAuthState]);

  useEffect(() => {
    // pageshow runs when history restores a bfcache page, so cross-tab sign-out
    // or a removed TOKEN_KEY cookie clears in-memory auth before private UI is reused.
    const syncAfterHistoryRestore = () => {
      if (!Cookies.get(TOKEN_KEY)) {
        clearAuthState();
      }
    };

    window.addEventListener("pageshow", syncAfterHistoryRestore);

    return () => {
      window.removeEventListener("pageshow", syncAfterHistoryRestore);
    };
  }, [clearAuthState]);

  const updateUser = useCallback((nextUser: UserResponse) => {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const signIn = useCallback(
    (response: AuthResponse) => {
      const expires = new Date(Date.now() + response.expiresIn * 1000);

      Cookies.set(TOKEN_KEY, response.token, {
        expires,
        sameSite: "strict",
      });
      updateUser(response.user);
    },
    [updateUser],
  );

  const signOut = useCallback(() => {
    Cookies.remove(TOKEN_KEY);
    clearAuthState();
    router.replace("/login");
    router.refresh();
  }, [clearAuthState, router]);

  const value = useMemo(
    () => ({ user, isLoading, signIn, signOut, updateUser }),
    [isLoading, signIn, signOut, updateUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Retrieve the current authentication context for the calling component.
 *
 * @returns The `AuthState` object containing `user`, `isLoading`, `signIn`, `signOut`, and `updateUser`.
 * @throws Error if called outside of an `AuthProvider`
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
