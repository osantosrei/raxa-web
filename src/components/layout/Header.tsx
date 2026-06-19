"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CHROMELESS_PREFIXES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/matches", label: "Peladas" },
  { href: "/profile", label: "Perfil" },
];

/**
 * Render a sticky top navigation header that is hidden for chromeless routes.
 *
 * When rendered, shows a logo link to /matches and, if an authenticated user
 * exists, a "Sair" sign-out button that triggers the configured sign-out action.
 *
 * @returns The header element when the current pathname does not start with a chromeless prefix, otherwise `null`.
 */
export function Header() {
  const pathname = usePathname();
  const isChromeless = CHROMELESS_PREFIXES.some((route) =>
    pathname.startsWith(route),
  );

  if (isChromeless) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/matches" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Raxa"
            width={288}
            height={162}
            className="h-auto w-28 object-contain sm:w-36"
            sizes="(min-width: 640px) 144px, 112px"
            quality={100}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/matches"
                ? pathname === "/matches" || pathname.startsWith("/matches/")
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-surface-high text-primary"
                    : "text-muted hover:text-text",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
