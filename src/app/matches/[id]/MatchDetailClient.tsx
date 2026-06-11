"use client";

import { CalendarDays, ChevronLeft, MapPin, Ticket, Users } from "lucide-react";
import Link from "next/link";

import { InfoRow } from "@/components/match/InfoRow";
import { MatchActions } from "@/components/match/MatchActions";
import { PlayerList } from "@/components/match/PlayerList";
import { StatusBadge } from "@/components/match/StatusBadge";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useMatchDetail } from "@/hooks/useMatches";
import { usePlayers } from "@/hooks/usePlayers";
import { formatMatchDate } from "@/lib/utils";
import { useAuth } from "@/store/authContext";

interface MatchDetailClientProps {
  id: string;
}

/**
 * Render the match detail page for a given match id.
 *
 * Displays match metadata, available actions, an optional invite code for the match creator,
 * and the confirmed players list. Handles loading and error states for match and player data
 * and triggers a refetch of both when actions complete.
 *
 * @param id - The match identifier to load and display
 * @returns The rendered match detail view
 */
export function MatchDetailClient({ id }: MatchDetailClientProps) {
  const { user } = useAuth();
  const {
    data: match,
    isLoading: isMatchLoading,
    isError: isMatchError,
    refetch: refetchMatch,
  } = useMatchDetail(id);
  const {
    data: players,
    isError: isPlayersError,
    refetch: refetchPlayers,
  } = usePlayers(id);

  if (isMatchLoading) {
    return <LoadingSpinner />;
  }

  if (isMatchError || !match) {
    return (
      <main className="mx-auto max-w-lg px-4 py-8">
        <ErrorMessage
          message="Erro ao carregar partida."
          onRetry={() => refetchMatch()}
        />
      </main>
    );
  }

  const isCreator = match.creator.id === user?.id;
  const isParticipant =
    players?.some((player) => player.userId === user?.id) ?? false;

  const refetchDetail = () => {
    refetchMatch();
    refetchPlayers();
  };

  return (
    <main className="mx-auto max-w-lg px-4 pb-24">
      <Link
        href="/matches"
        className="flex items-center gap-1 py-4 text-sm text-muted"
      >
        <ChevronLeft size={16} /> Voltar
      </Link>

      <div className="mb-4 flex items-start justify-between gap-3">
        <h1 className="text-2xl font-extrabold leading-tight text-text">
          {match.title}
        </h1>
        <StatusBadge status={match.status} />
      </div>

      <section className="mb-4 flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
        <InfoRow icon={<MapPin size={16} />} text={match.location} />
        <InfoRow
          icon={<CalendarDays size={16} />}
          text={formatMatchDate(match.scheduledAt)}
        />
        <InfoRow
          icon={<Users size={16} />}
          text={`${match.currentPlayers} de ${match.maxPlayers} confirmados`}
        />
      </section>

      <MatchActions
        match={match}
        isCreator={isCreator}
        isParticipant={isParticipant}
        onActionComplete={refetchDetail}
      />

      {isCreator && match.inviteCode && (
        <section className="mb-4 rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
            <Ticket size={16} className="text-primary" />
            Código de convite
          </div>
          <p className="rounded-lg bg-surface-high px-3 py-2 font-mono text-sm text-muted">
            {match.inviteCode}
          </p>
        </section>
      )}

      {isPlayersError && (
        <ErrorMessage
          className="mb-4"
          message="Erro ao carregar jogadores."
          onRetry={() => refetchPlayers()}
        />
      )}

      <h2 className="mb-3 mt-6 font-bold text-text">Confirmados</h2>
      <PlayerList players={players ?? []} />
    </main>
  );
}
