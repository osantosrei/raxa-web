import { PlayerJerseyIcon } from "@/components/match/PlayerJerseyIcon";
import { cn } from "@/lib/utils";
import type { DrawnTeam } from "@/lib/teamDraw";

interface TeamCardProps {
  team: DrawnTeam;
  index: number;
}

const TEAM_STYLES = [
  {
    border: "border-blue-500/80",
    dot: "bg-blue-500",
    player: "text-blue-50",
    title: "text-blue-100",
    tone: "blue",
  },
  {
    border: "border-red-500/80",
    dot: "bg-red-500",
    player: "text-red-50",
    title: "text-red-100",
    tone: "red",
  },
  {
    border: "border-primary/70",
    dot: "bg-primary",
    player: "text-text",
    title: "text-text",
    tone: "neutral",
  },
] as const;

export function TeamCard({ team, index }: TeamCardProps) {
  const style = TEAM_STYLES[index] ?? TEAM_STYLES[2];

  return (
    <section className={cn("rounded-xl border bg-surface p-4", style.border)}>
      <div className="mb-3 flex items-center gap-2">
        <span className={cn("h-2.5 w-2.5 rounded-full", style.dot)} aria-hidden />
        <h3 className={cn("font-bold", style.title)}>{team.name}</h3>
        <span className="ml-auto shrink-0 text-xs font-normal text-muted">
          {team.players.length} jogadores
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {team.players.map((player, playerIndex) => (
          <li key={player} className="flex min-w-0 items-center gap-2 text-sm">
            <PlayerJerseyIcon number={playerIndex + 1} tone={style.tone} />
            <span className={cn("min-w-0 truncate", style.player)}>{player}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
