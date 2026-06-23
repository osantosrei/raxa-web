"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";

import { TeamDrawModal } from "@/components/match/TeamDrawModal";
import { getEffectiveMatchStatus } from "@/lib/matches";
import type { MatchResponse, PlayerResponse } from "@/types/api";

interface TeamDrawButtonProps {
  match: MatchResponse;
  players: PlayerResponse[];
}

export function TeamDrawButton({ match, players }: TeamDrawButtonProps) {
  const [open, setOpen] = useState(false);
  const effectiveStatus = getEffectiveMatchStatus(match);

  if (
    players.length < 2 ||
    effectiveStatus === "FINISHED" ||
    effectiveStatus === "CANCELLED"
  ) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-bold text-text transition-colors hover:bg-surface-high"
      >
        <Shuffle size={16} className="text-primary" />
        Sortear times
      </button>

      {open && (
        <TeamDrawModal
          match={match}
          players={players}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
