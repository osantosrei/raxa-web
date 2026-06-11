"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/store/authContext";

const CHROMELESS_PREFIXES = ["/login", "/register", "/invite"];

export function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const isChromeless = CHROMELESS_PREFIXES.some((route) =>
    pathname.startsWith(route),
  );

  if (isChromeless) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/matches" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Raxa"
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <span className="font-outfit text-xl font-extrabold text-primary">
            raxa
          </span>
        </Link>

        {user && (
          <button
            type="button"
            onClick={signOut}
            className="text-sm text-muted transition-colors hover:text-text"
          >
            Sair
          </button>
        )}
      </div>
    </header>
  );
}
