"use client";

import { CalendarDays, CircleDot, Plus, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { MatchCard } from "@/components/match/MatchCard";
import { buttonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useMatches } from "@/hooks/useMatches";
import {
  filterMatches,
  getActiveMatches,
  getHistoryMatches,
  getMatchesStats,
  getNextMatch,
  type MatchFilter,
} from "@/lib/matches";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/authContext";

const filters: Array<{ label: string; value: MatchFilter }> = [
  { label: "Todas", value: "ALL" },
  { label: "Minhas", value: "MINE" },
  { label: "Abertas", value: "OPEN" },
  { label: "Encerradas", value: "ENDED" },
];

function SectionHeading({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-text">{title}</h2>
      <span className="text-xs font-semibold text-muted">
        {count} {count === 1 ? "pelada" : "peladas"}
      </span>
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-5 text-sm text-muted">
      {message}
    </div>
  );
}

export default function MatchesPage() {
  const { user } = useAuth();
  const { data: matches, isLoading, isError, refetch } = useMatches();
  const [activeFilter, setActiveFilter] = useState<MatchFilter>("ALL");

  const {
    activeMatches,
    filteredMatches,
    historyMatches,
    nextMatch,
    stats,
  } = useMemo(() => {
    const filtered = filterMatches(matches ?? [], activeFilter, user?.id);
    const next = getNextMatch(filtered);

    return {
      activeMatches: getActiveMatches(filtered).filter(
        (match) => match.id !== next?.id,
      ),
      filteredMatches: filtered,
      historyMatches: getHistoryMatches(filtered),
      nextMatch: next,
      stats: getMatchesStats(filtered),
    };
  }, [activeFilter, matches, user?.id]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 py-5">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">Peladas</h1>
        <Link
          href="/matches/new"
          className={buttonClassName({
            className: "gap-2 px-4 sm:px-5",
          })}
        >
          <Plus size={18} />
          Nova Pelada
        </Link>
      </div>

      {isLoading && <LoadingSpinner />}

      {isError && (
        <ErrorMessage
          message="Erro ao carregar partidas."
          onRetry={() => refetch()}
        />
      )}

      {matches && matches.length === 0 && (
        <EmptyState
          icon={<Trophy size={30} strokeWidth={2.2} />}
          title="Nenhuma pelada ainda"
          description="Crie uma partida ou entre via link de convite."
          action={{ label: "Criar partida", href: "/matches/new" }}
        />
      )}

      {matches && matches.length > 0 && (
        <div className="flex flex-col gap-6">
          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-4">
              <CircleDot size={20} className="mb-3 text-primary" />
              <p className="text-2xl font-extrabold text-text">
                {stats.activeCount}
              </p>
              <p className="text-sm font-medium text-muted">Peladas Ativas</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <Users size={20} className="mb-3 text-primary" />
              <p className="text-2xl font-extrabold text-text">
                {stats.participationCount}
              </p>
              <p className="text-sm font-medium text-muted">Participações</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <CalendarDays size={20} className="mb-3 text-primary" />
              <p className="text-2xl font-extrabold text-text">
                {stats.nextLabel}
              </p>
              <p className="text-sm font-medium text-muted">Próxima</p>
            </div>
          </section>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => {
              const active = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors",
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-muted hover:text-text",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {filteredMatches.length === 0 ? (
            <EmptySection message="Nenhuma pelada encontrada para este filtro." />
          ) : (
            <>
              {nextMatch && (
                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <CircleDot size={18} className="text-primary" />
                    <h2 className="text-lg font-extrabold text-text">
                      Próxima Pelada
                    </h2>
                  </div>
                  <MatchCard match={nextMatch} featured />
                </section>
              )}

              <section>
                <SectionHeading
                  title="Peladas Ativas"
                  count={activeMatches.length}
                />
                {activeMatches.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {activeMatches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                ) : (
                  <EmptySection message="Nenhuma pelada ativa neste filtro." />
                )}
              </section>

              <section>
                <SectionHeading title="Histórico" count={historyMatches.length} />
                {historyMatches.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {historyMatches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                ) : (
                  <EmptySection message="Nenhuma pelada no histórico deste filtro." />
                )}
              </section>
            </>
          )}
        </div>
      )}
    </main>
  );
}
