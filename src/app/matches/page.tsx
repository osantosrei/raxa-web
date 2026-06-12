"use client";

import { Trophy } from "lucide-react";
import Link from "next/link";

import { MatchCard } from "@/components/match/MatchCard";
import { buttonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useMatches } from "@/hooks/useMatches";

export default function MatchesPage() {
  const { data: matches, isLoading, isError, refetch } = useMatches();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-5">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">Peladas</h1>
        <Link href="/matches/new" className={buttonClassName()}>
          Nova
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

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {matches?.map((match) => <MatchCard key={match.id} match={match} />)}
      </div>
    </main>
  );
}
