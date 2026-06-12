import { CalendarDays, MapPin, Users } from "lucide-react";

import { InfoRow } from "@/components/match/InfoRow";
import { StatusBadge } from "@/components/match/StatusBadge";
import { TeamDrawButton } from "@/components/match/TeamDrawButton";
import { formatMatchDate } from "@/lib/utils";
import type { MatchResponse, PlayerResponse } from "@/types/api";

const creator = {
  id: "preview-creator",
  name: "Organizador",
  email: "organizador@raxa.local",
  phone: null,
};

const match: MatchResponse = {
  id: "preview-match",
  title: "Pelada da Sexta",
  location: "Arena Raxa",
  scheduledAt: "2026-06-12T20:00:00",
  maxPlayers: 18,
  currentPlayers: 13,
  status: "OPEN",
  creator,
  inviteCode: "PREVIEW",
  createdAt: "2026-06-12T12:00:00",
};

const players: PlayerResponse[] = [
  "Ana",
  "Bruno",
  "Caio",
  "Duda",
  "Edu",
  "Fabi",
  "Gui",
  "Helena",
  "Igor",
  "Julia",
  "Kadu",
  "Lari",
  "Marta",
].map((name, index) => ({
  userId: `preview-player-${index + 1}`,
  name,
  joinedAt: "2026-06-12T12:00:00",
}));

export default function TeamDrawPreviewPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="py-5">
        <p className="text-sm font-semibold text-primary">Preview</p>
        <h1 className="mt-1 text-2xl font-extrabold text-text sm:text-3xl">
          Sorteio de times
        </h1>
      </div>

      <section className="mb-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-text">{match.title}</h2>
          <StatusBadge status={match.status} />
        </div>

        <div className="flex flex-col gap-2">
          <InfoRow icon={<MapPin size={16} />} text={match.location} />
          <InfoRow
            icon={<CalendarDays size={16} />}
            text={formatMatchDate(match.scheduledAt)}
          />
          <InfoRow
            icon={<Users size={16} />}
            text={`${players.length} de ${match.maxPlayers} confirmados`}
          />
        </div>
      </section>

      <TeamDrawButton match={match} players={players} />
    </main>
  );
}
