import type { DrawnTeam } from "@/lib/teamDraw";

interface TeamCardProps {
  team: DrawnTeam;
  index: number;
}

const TEAM_ACCENTS = [
  "border-l-primary",
  "border-l-success",
  "border-l-warning",
  "border-l-danger",
  "border-l-blue-500",
  "border-l-purple-500",
];

export function TeamCard({ team, index }: TeamCardProps) {
  const accent = TEAM_ACCENTS[index % TEAM_ACCENTS.length];

  return (
    <section className={`rounded-xl border border-border border-l-4 ${accent} bg-surface p-4`}>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden />
        <h3 className="font-bold text-text">{team.name}</h3>
        <span className="ml-auto text-xs font-normal text-muted">
          {team.players.length} jogadores
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {team.players.map((player) => (
          <li key={player} className="flex items-center gap-2 text-sm text-text">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
            {player}
          </li>
        ))}
      </ul>
    </section>
  );
}
