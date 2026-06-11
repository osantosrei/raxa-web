"use client";

import { Home, PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CHROMELESS_PREFIXES } from "@/lib/routes";

const links = [
  { href: "/matches", icon: Home, label: "Início" },
  { href: "/matches/new", icon: PlusCircle, label: "Criar" },
  { href: "/profile", icon: User, label: "Perfil" },
];

const CHROMELESS_PREFIXES = ["/login", "/register", "/invite"];

/**
 * Renders a fixed bottom navigation bar on small screens and highlights the active route.
 *
 * The bar is hidden on medium and larger screens and is not rendered when the current
 * pathname begins with any value in `CHROMELESS_PREFIXES` (e.g., authentication routes).
 *
 * @returns A JSX `nav` element containing the navigation links, or `null` if the bar is hidden.
export function BottomNav() {
  const pathname = usePathname();
  const isChromeless = CHROMELESS_PREFIXES.some((route) =>
    pathname.startsWith(route),
  );

  if (isChromeless) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface md:hidden">
      <div className="mx-auto flex max-w-lg">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
                active ? "text-primary" : "text-muted hover:text-text"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              <span className={active ? "font-bold" : "font-medium"}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
