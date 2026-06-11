import type { MatchStatus } from "@/types/api";

const statusConfig: Record<MatchStatus, { label: string; classes: string }> = {
  OPEN: { label: "Aberta", classes: "bg-success/10 text-success" },
  FULL: { label: "Cheia", classes: "bg-warning/10 text-warning" },
  CANCELLED: { label: "Cancelada", classes: "bg-danger/10 text-danger" },
  FINISHED: { label: "Encerrada", classes: "bg-muted/10 text-muted" },
};

/**
 * Renders a compact badge displaying a Portuguese label for the given match status.
 *
 * @param status - MatchStatus value that determines the badge label and styling
 * @returns The span element used as a styled status badge
 */
export function StatusBadge({ status }: { status: MatchStatus }) {
  const { label, classes } = statusConfig[status];

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}
