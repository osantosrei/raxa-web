interface ReservesCardProps {
  players: string[];
}

export function ReservesCard({ players }: ReservesCardProps) {
  if (players.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-dashed border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-warning" aria-hidden />
        <h3 className="font-bold text-warning">Reservas</h3>
        <span className="ml-auto text-xs font-normal text-muted">
          {players.length} jogador{players.length > 1 ? "es" : ""}
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {players.map((player) => (
          <li key={player} className="flex items-center gap-2 text-sm text-muted">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
            {player}
          </li>
        ))}
      </ul>
    </section>
  );
}
