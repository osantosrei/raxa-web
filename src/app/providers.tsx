"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/store/authContext";

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
