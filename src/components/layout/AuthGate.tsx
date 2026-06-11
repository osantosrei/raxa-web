"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { isPublicPath } from "@/lib/routes";
import { useAuth } from "@/store/authContext";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPublic = isPublicPath(pathname);

  useEffect(() => {
    if (isLoading || user || isPublic) {
      return;
    }

    const query = searchParams.toString();
    const redirect = `${pathname}${query ? `?${query}` : ""}`;

    router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    router.refresh();
  }, [isLoading, isPublic, pathname, router, searchParams, user]);

  if (!isPublic && (isLoading || !user)) {
    return <LoadingSpinner />;
  }

  return children;
}
