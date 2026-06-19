import { CalendarDays, MapPin, Users } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/match/StatusBadge";
import { cn } from "@/lib/utils";
import { getEffectiveMatchStatus, getMatchDateToneLabel } from "@/lib/matches";
import { formatMatchDate } from "@/lib/utils";
import type { MatchResponse } from "@/types/api";

/**
 * Render a clickable match summary card for a given match.
 *
 * Displays the match title with a status badge, location, formatted scheduled date,
 * current/max player counts, and remaining open spots when available. The card links
 * to `/matches/{match.id}`.
 *
 * @param match - Match data used to populate the card fields
 * @returns A JSX element linking to the match details and showing its summary
 */
export function MatchCard({
  match,
  featured = false,
}: {
  match: MatchResponse;
  featured?: boolean;
}) {
  const spotsLeft = match.maxPlayers - match.currentPlayers;
  const effectiveStatus = getEffectiveMatchStatus(match);
  const dateToneLabel = getMatchDateToneLabel(match.scheduledAt);

  return (
    <Link href={`/matches/${match.id}`} className="block h-full">
      <article
        className={cn(
          "h-full rounded-xl border bg-surface p-4 transition-colors hover:bg-surface-high active:scale-[0.99]",
          featured
            ? "border-primary/70 bg-surface-high shadow-[0_0_0_1px_rgba(255,107,0,0.18)]"
            : "border-border",
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            {dateToneLabel}
          </span>
          <StatusBadge status={effectiveStatus} prominent />
        </div>

        <div className="mb-3 flex items-start justify-between gap-2">
          <h3
            className={cn(
              "min-w-0 break-words font-bold leading-tight text-text",
              featured ? "text-xl" : "text-base",
            )}
          >
            {match.title}
          </h3>
        </div>

        <div className="flex flex-col gap-1 text-sm text-muted">
          <span className="flex min-w-0 items-center gap-2">
            <MapPin size={16} /> {match.location}
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays size={16} /> {formatMatchDate(match.scheduledAt)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="flex items-center gap-2 text-sm font-medium text-text">
            <Users size={16} />
            {match.currentPlayers}/{match.maxPlayers} jogadores
          </span>
          {spotsLeft > 0 && effectiveStatus === "OPEN" && (
            <span className="text-xs font-medium text-success">
              {spotsLeft} vaga{spotsLeft > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
