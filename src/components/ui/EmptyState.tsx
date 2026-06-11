import Link from "next/link";

import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 py-10 text-center">
      <span className="text-3xl" aria-hidden>
        {icon}
      </span>
      <h2 className="mt-3 text-lg font-bold text-text">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
      {action && (
        <Link href={action.href} className="mt-5">
          <Button label={action.label} />
        </Link>
      )}
    </div>
  );
}
