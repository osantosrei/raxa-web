import { PlayerJerseyIcon } from "@/components/match/PlayerJerseyIcon";

interface ReservesCardProps {
  players: string[];
}

export function ReservesCard({ players }: ReservesCardProps) {
  if (players.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-yellow-400/80 bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" aria-hidden />
        <h3 className="font-bold text-warning">Reservas</h3>
        <span className="ml-auto shrink-0 text-xs font-normal text-muted">
          {players.length} jogador{players.length > 1 ? "es" : ""}
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {players.map((player, index) => (
          <li key={player} className="flex min-w-0 items-center gap-2 text-sm text-muted">
            <PlayerJerseyIcon number={index + 1} tone="yellow" />
            <span className="min-w-0 truncate">{player}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
