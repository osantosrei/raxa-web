"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/store/authContext";

/**
 * Wraps application UI with React Query and app-level providers, and renders persistent layout chrome.
 *
 * @param children - The application content to render between the persistent Header and BottomNav.
 * @returns A React element that provides a QueryClient (queries default to 30s stale time and 1 retry), an AuthProvider, the Header, the given `children`, the BottomNav, and the React Query Devtools.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Header />
        {children}
        <BottomNav />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
