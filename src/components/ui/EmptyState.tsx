import Link from "next/link";
import type { ReactNode } from "react";

import { buttonClassName } from "@/components/ui/Button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

/**
 * Renders a centered empty-state panel showing an icon, title, description, and an optional action link.
 *
 * @param icon - Visible icon content (rendered inside a visually prominent span)
 * @param title - Heading text displayed below the icon
 * @param description - Supporting descriptive text displayed under the title
 * @param action - Optional action object with `label` and `href` used to render a call-to-action link
 * @returns The rendered empty-state JSX element
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 py-10 text-center">
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
        aria-hidden
      >
        {icon}
      </span>
      <h2 className="mt-3 text-lg font-bold text-text">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
      {action && (
        <Link
          href={action.href}
          className={buttonClassName({ className: "mt-5" })}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
