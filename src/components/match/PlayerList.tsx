import { getInitials } from "@/lib/utils";
import type { PlayerResponse } from "@/types/api";

/**
 * Renders a vertical list of confirmed players or an empty-state message when none are provided.
 *
 * @param players - Array of player objects; each must have `userId` (used as React key) and `name` (used for display and initials).
 * @returns A JSX element containing player rows (initials, name, and the "Confirmado" label) or a bordered empty-state card when `players` is empty.
 */
export function PlayerList({ players }: { players: PlayerResponse[] }) {
  if (players.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
        Nenhum jogador confirmado ainda.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {players.map((player) => (
        <div
          key={player.userId}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-high text-sm font-bold text-primary">
            {getInitials(player.name)}
          </div>
          <div>
            <p className="font-medium text-text">{player.name}</p>
            <p className="text-xs text-muted">Confirmado</p>
          </div>
        </div>
      ))}
    </div>
  );
}
