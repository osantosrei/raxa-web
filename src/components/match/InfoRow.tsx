import type { ReactNode } from "react";

interface InfoRowProps {
  icon: ReactNode;
  text: string;
}

export function InfoRow({ icon, text }: InfoRowProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <span className="shrink-0 text-base" aria-hidden>
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}
