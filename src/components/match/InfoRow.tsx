import type { ReactNode } from "react";

interface InfoRowProps {
  icon: ReactNode;
  text: string;
}

/**
 * Render a horizontal info row with an icon and accompanying text.
 *
 * The icon is marked decorative (`aria-hidden`) and is rendered with fixed sizing to avoid shrinking.
 *
 * @param icon - Decorative icon content to display at the start of the row
 * @param text - Text content displayed next to the icon
 * @returns A JSX element containing the icon and text arranged in a compact horizontal row
 */
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
