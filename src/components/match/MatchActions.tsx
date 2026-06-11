"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useCancelMatch } from "@/hooks/useMatches";
import { useJoinMatch, useLeaveMatch } from "@/hooks/usePlayers";
import type { MatchResponse } from "@/types/api";

interface MatchActionsProps {
  match: MatchResponse;
  isCreator: boolean;
  isParticipant: boolean;
  onActionComplete: () => void;
}

function getApiErrorMessage(err: unknown) {
  return err && typeof err === "object" && "message" in err
    ? String(err.message)
    : "Algo deu errado.";
}

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

  const isPast = new Date(match.scheduledAt) < new Date();
  const isCancelled = match.status === "CANCELLED";
  const isFull = match.status === "FULL";

  if (isCancelled) {
    return (
      <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
        Esta partida foi cancelada.
      </div>
    );
  }

  if (isPast) {
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
