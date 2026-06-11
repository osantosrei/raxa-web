"use client";

import Link from "next/link";

import { MatchCard } from "@/components/match/MatchCard";
import { buttonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useMatches } from "@/hooks/useMatches";
import { useAuth } from "@/store/authContext";

/**
 * Displays the Matches page with a user greeting, a link to create a new match, and the current matches list.
 *
 * Renders a header with the title "Peladas", a greeting that uses the user's first name, and a "Nova" button linking to /matches/new. Shows a loading spinner while match data is loading, an error message with a retry action when loading fails, and an empty-state prompt with an action to create a match when there are no matches. When matches are available, renders a vertical list of MatchCard components keyed by match id.
 *
 * @returns The Matches page as a JSX element
 */
export default function MatchesPage() {
  const { data: matches, isLoading, isError, refetch } = useMatches();
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-lg px-4 pb-24">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-xl font-bold text-text">Peladas</h1>
          <p className="text-sm text-muted">Olá, {user?.name.split(" ")[0]}</p>
        </div>
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
          icon="⚽"
          title="Nenhuma pelada ainda"
          description="Crie uma partida ou entre via link de convite."
          action={{ label: "Criar partida", href: "/matches/new" }}
        />
      )}

      <div className="flex flex-col gap-3">
        {matches?.map((match) => <MatchCard key={match.id} match={match} />)}
      </div>
    </main>
  );
}
