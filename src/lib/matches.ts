import type { MatchStatus } from "@/types/api";

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
