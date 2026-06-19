import { format, isThisWeek, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { MatchResponse, MatchStatus } from "@/types/api";

interface MatchStatusSource {
  scheduledAt: string;
  status: MatchStatus;
}

export function isMatchEnded(scheduledAt: string, now = new Date()) {
  const scheduledAtDate = new Date(scheduledAt);

  return (
    !Number.isNaN(scheduledAtDate.getTime()) && scheduledAtDate.getTime() < now.getTime()
  );
}

export function getEffectiveMatchStatus(match: MatchStatusSource): MatchStatus {
  if (match.status === "CANCELLED") {
    return "CANCELLED";
  }

  if (isMatchEnded(match.scheduledAt)) {
    return "FINISHED";
  }

  return match.status;
}

export function canAcceptParticipants(match: MatchStatusSource) {
  return getEffectiveMatchStatus(match) === "OPEN";
}

export type MatchFilter = "ALL" | "MINE" | "OPEN" | "ENDED";

function getMatchTime(match: Pick<MatchResponse, "scheduledAt">) {
  return new Date(match.scheduledAt).getTime();
}

function isActiveMatch(match: MatchResponse) {
  const status = getEffectiveMatchStatus(match);

  return status === "OPEN" || status === "FULL";
}

function isHistoryMatch(match: MatchResponse) {
  const status = getEffectiveMatchStatus(match);

  return status === "FINISHED" || status === "CANCELLED";
}

export function sortMatchesByDateAsc(matches: MatchResponse[]) {
  return [...matches].sort((a, b) => getMatchTime(a) - getMatchTime(b));
}

export function sortMatchesByDateDesc(matches: MatchResponse[]) {
  return [...matches].sort((a, b) => getMatchTime(b) - getMatchTime(a));
}

export function filterMatches(
  matches: MatchResponse[],
  filter: MatchFilter,
  userId?: string,
) {
  if (filter === "MINE") {
    return matches.filter((match) => match.creator.id === userId);
  }

  if (filter === "OPEN") {
    return matches.filter((match) => getEffectiveMatchStatus(match) === "OPEN");
  }

  if (filter === "ENDED") {
    return matches.filter(isHistoryMatch);
  }

  return matches;
}

export function getActiveMatches(matches: MatchResponse[]) {
  return sortMatchesByDateAsc(matches.filter(isActiveMatch));
}

export function getHistoryMatches(matches: MatchResponse[]) {
  return sortMatchesByDateDesc(matches.filter(isHistoryMatch));
}

export function getNextMatch(matches: MatchResponse[]) {
  return getActiveMatches(matches)[0] ?? null;
}

export function getMatchesStats(matches: MatchResponse[]) {
  const activeMatches = getActiveMatches(matches);
  const nextMatch = activeMatches[0] ?? null;

  return {
    activeCount: activeMatches.length,
    participationCount: activeMatches.reduce(
      (total, match) => total + match.currentPlayers,
      0,
    ),
    nextLabel: nextMatch
      ? format(new Date(nextMatch.scheduledAt), "dd MMM", { locale: ptBR })
      : "Sem agenda",
  };
}

export function getMatchDateToneLabel(scheduledAt: string) {
  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return "Data inválida";
  }

  if (isToday(date)) {
    return "Hoje";
  }

  if (isTomorrow(date)) {
    return "Amanhã";
  }

  if (isThisWeek(date, { weekStartsOn: 1 })) {
    return "Esta semana";
  }

  return format(date, "dd MMM", { locale: ptBR });
}
