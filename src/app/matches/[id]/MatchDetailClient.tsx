"use client";

import { CalendarDays, ChevronLeft, MapPin, Users } from "lucide-react";
import Link from "next/link";

import { InfoRow } from "@/components/match/InfoRow";
import { InviteShareWidget } from "@/components/match/InviteShareWidget";
import { MatchActions } from "@/components/match/MatchActions";
import { PlayerList } from "@/components/match/PlayerList";
import { StatusBadge } from "@/components/match/StatusBadge";
import { TeamDrawButton } from "@/components/match/TeamDrawButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useMatchDetail } from "@/hooks/useMatches";
import { usePlayers } from "@/hooks/usePlayers";
import { getEffectiveMatchStatus } from "@/lib/matches";
import { formatMatchDate } from "@/lib/utils";
import { useAuth } from "@/store/authContext";

interface MatchDetailClientProps {
  id: string;
}

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
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
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
  const effectiveStatus = getEffectiveMatchStatus(match);
  const isInactive =
    effectiveStatus === "FINISHED" || effectiveStatus === "CANCELLED";

  const refetchDetail = () => {
    refetchMatch();
    refetchPlayers();
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
      <Link
        href="/matches"
        className="flex items-center gap-1 py-4 text-sm text-muted"
      >
        <ChevronLeft size={16} /> Voltar
      </Link>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-2xl font-extrabold leading-tight text-text sm:text-3xl">
              {match.title}
            </h1>
            <StatusBadge status={effectiveStatus} />
          </div>

          <section className="mb-4 flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 sm:p-5">
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

          {isCreator && match.inviteCode && !isInactive && (
            <InviteShareWidget inviteCode={match.inviteCode} />
          )}

          {isCreator && players && players.length >= 2 && !isInactive && (
            <div className="mt-4">
              <TeamDrawButton match={match} players={players} />
            </div>
          )}
        </div>

        <aside>
          {isPlayersError && (
            <ErrorMessage
              className="mb-4"
              message="Erro ao carregar jogadores."
              onRetry={() => refetchPlayers()}
            />
          )}

          <h2 className="mb-3 font-bold text-text">Confirmados</h2>
          <PlayerList players={players ?? []} />
        </aside>
      </div>
    </main>
  );
}
