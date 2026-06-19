"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useCancelMatch } from "@/hooks/useMatches";
import { useJoinMatch, useLeaveMatch } from "@/hooks/usePlayers";
import { getEffectiveMatchStatus } from "@/lib/matches";
import type { MatchResponse } from "@/types/api";

interface MatchActionsProps {
  match: MatchResponse;
  isCreator: boolean;
  isParticipant: boolean;
  onActionComplete: () => void;
}

/**
 * Extracts a user-facing error message from an unknown error value.
 *
 * @param err - The error value to inspect for a `message` property
 * @returns The `message` property converted to a string if present; otherwise the fallback `"Algo deu errado."`
 */
function getApiErrorMessage(err: unknown) {
  return err && typeof err === "object" && "message" in err
    ? String(err.message)
    : "Algo deu errado.";
}

/**
 * Render action controls for a match, conditionally showing join, leave, or cancel buttons or a status banner.
 *
 * @param match - The match object (must include `id`, `scheduledAt`, and `status`) used to derive available actions and display state
 * @param isCreator - Whether the current user is the match creator
 * @param isParticipant - Whether the current user is a participant in the match
 * @param onActionComplete - Callback invoked after a successful action (join, leave, or cancel)
 * @returns The rendered JSX for match action controls or a status banner
 */
export function MatchActions({
  match,
  isCreator,
  isParticipant,
  onActionComplete,
}: MatchActionsProps) {
  const joinMatch = useJoinMatch(match.id);
  const leaveMatch = useLeaveMatch(match.id);
  const cancelMatch = useCancelMatch();
  const [error, setError] = useState<string | null>(null);

  const handle = async (action: () => Promise<unknown>) => {
    setError(null);

    try {
      await action();
      onActionComplete();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const effectiveStatus = getEffectiveMatchStatus(match);
  const isCancelled = effectiveStatus === "CANCELLED";
  const isEnded = effectiveStatus === "FINISHED";
  const isFull = effectiveStatus === "FULL";

  if (isCancelled) {
    return (
      <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
        Esta partida foi cancelada.
      </div>
    );
  }

  if (isEnded) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
        Esta partida já foi realizada.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <ErrorMessage message={error} />}

      {isCreator && (
        <Button
          label="Cancelar partida"
          variant="danger"
          loading={cancelMatch.isPending}
          onClick={() => handle(() => cancelMatch.mutateAsync(match.id))}
          fullWidth
        />
      )}

      {!isCreator && !isParticipant && (
        <Button
          label={isFull ? "Partida cheia" : "Entrar na partida"}
          disabled={isFull}
          loading={joinMatch.isPending}
          onClick={() => handle(joinMatch.mutateAsync)}
          fullWidth
        />
      )}

      {!isCreator && isParticipant && (
        <Button
          label="Sair da partida"
          variant="secondary"
          loading={leaveMatch.isPending}
          onClick={() => handle(leaveMatch.mutateAsync)}
          fullWidth
        />
      )}
    </div>
  );
}
