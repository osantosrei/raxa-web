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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);

    if (!token) {
      window.localStorage.removeItem(USER_STORAGE_KEY);
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
  }, []);

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
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, isLoading, signIn, signOut, updateUser }),
    [isLoading, signIn, signOut, updateUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
