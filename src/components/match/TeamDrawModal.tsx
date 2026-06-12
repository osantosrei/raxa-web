"use client";

import { Check, Copy, Shuffle, X } from "lucide-react";
import { useMemo, useState } from "react";

import { ReservesCard } from "@/components/match/ReservesCard";
import { TeamCard } from "@/components/match/TeamCard";
import { drawTeams, formatDrawForSharing, type DrawResult } from "@/lib/teamDraw";
import type { MatchResponse, PlayerResponse } from "@/types/api";

interface TeamDrawModalProps {
  match: MatchResponse;
  players: PlayerResponse[];
  onClose: () => void;
}

function getDrawPreview(playerCount: number, teamSize: number | null) {
  if (!teamSize || teamSize < 2) {
    return "Informe pelo menos 2 jogadores por time.";
  }

  if (playerCount < teamSize) {
    return "Jogadores insuficientes para formar um time.";
  }

  const teams = Math.floor(playerCount / teamSize);
  const reserves = playerCount % teamSize;

  return `Vai gerar ${teams} time${teams > 1 ? "s" : ""}${
    reserves > 0
      ? ` e ${reserves} reserva${reserves > 1 ? "s" : ""}`
      : " e nenhuma reserva"
  }.`;
}

export function TeamDrawModal({ match, players, onClose }: TeamDrawModalProps) {
  const [teamSizeInput, setTeamSizeInput] = useState("5");
  const [result, setResult] = useState<DrawResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const playerNames = useMemo(() => players.map((player) => player.name), [players]);
  const teamSize = Number.parseInt(teamSizeInput, 10);
  const validTeamSize = Number.isNaN(teamSize) ? null : teamSize;
  const canDraw =
    validTeamSize !== null && validTeamSize >= 2 && playerNames.length >= validTeamSize;
  const preview = getDrawPreview(playerNames.length, validTeamSize);

  const handleDraw = () => {
    setError(null);
    setCopied(false);

    try {
      setResult(drawTeams(playerNames, validTeamSize ?? 0));
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Não foi possível sortear os times.",
      );
    }
  };

  const handleCopy = async () => {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(formatDrawForSharing(result, match.title));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Não foi possível copiar o resultado.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="flex max-h-[90dvh] w-full max-w-md flex-col rounded-2xl border border-border bg-background">
        <header className="flex shrink-0 items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-extrabold text-text">Sortear times</h2>
            <p className="mt-0.5 text-xs text-muted">
              {playerNames.length} jogador{playerNames.length !== 1 ? "es" : ""} confirmado
              {playerNames.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted transition-colors hover:bg-surface hover:text-text"
            aria-label="Fechar sorteio"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-5">
            <label
              htmlFor="team-size"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Jogadores por time
            </label>
            <div className="flex items-center gap-3">
              <input
                id="team-size"
                type="number"
                min={2}
                max={playerNames.length}
                value={teamSizeInput}
                onChange={(event) => {
                  setTeamSizeInput(event.target.value);
                  setError(null);
                }}
                className="w-20 rounded-xl border border-border bg-surface-high px-3 py-2.5 text-center text-sm font-bold text-text outline-none transition-colors focus:border-primary"
              />
              <p className="text-xs leading-snug text-muted">{preview}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-3">
              {result.teams.map((team, index) => (
                <TeamCard key={team.name} team={team} index={index} />
              ))}
              <ReservesCard players={result.reserves} />
            </div>
          )}
        </div>

        <footer className="flex shrink-0 flex-col gap-2 border-t border-border p-5">
          <button
            type="button"
            onClick={handleDraw}
            disabled={!canDraw}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Shuffle size={16} />
            {result ? "Sortear novamente" : "Sortear"}
          </button>

          {result && (
            <button
              type="button"
              onClick={handleCopy}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3 text-sm font-bold text-text transition-colors hover:bg-surface-high"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-success" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copiar resultado
                </>
              )}
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}
