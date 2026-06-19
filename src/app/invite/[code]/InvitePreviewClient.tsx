"use client";

import { CalendarDays, Link2Off, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { InfoRow } from "@/components/match/InfoRow";
import { StatusBadge } from "@/components/match/StatusBadge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useInvitePreview, useJoinViaInvite } from "@/hooks/useInvite";
import { getEffectiveMatchStatus } from "@/lib/matches";
import { formatMatchDate } from "@/lib/utils";
import { useAuth } from "@/store/authContext";

interface InvitePreviewClientProps {
  code: string;
}

/**
 * Extracts a human-readable message from an error-like value or returns the provided fallback.
 *
 * @param err - The value that may contain a `message` property.
 * @param fallback - The string to return when `err` does not contain a message.
 * @returns The `message` property converted to a string if present, otherwise `fallback`.
 */
function getApiErrorMessage(err: unknown, fallback: string) {
  return err && typeof err === "object" && "message" in err
    ? String(err.message)
    : fallback;
}

/**
 * Render an invite preview UI for the provided invite code and handle the join flow.
 *
 * Shows loading, invalid-invite, or preview states; prompts unauthenticated users to log in (preserving redirect back to the invite); attempts to join the match when the user confirms presence, navigates to the match page on success, and displays a user-facing error message on failure.
 *
 * @param code - The invite code used to fetch and display the match preview
 * @returns The rendered invite preview component
 */
export function InvitePreviewClient({ code }: InvitePreviewClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { data: preview, isLoading, isError } = useInvitePreview(code);
  const joinViaInvite = useJoinViaInvite();
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/invite/${code}`)}`);
      return;
    }

    setError(null);

    try {
      const match = await joinViaInvite.mutateAsync(code);
      router.replace(`/matches/${match.id}`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível entrar na partida."));
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !preview) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <EmptyState
            icon={<Link2Off size={30} strokeWidth={2.2} />}
            title="Convite inválido"
            description="Este convite não existe ou foi desativado."
          />
        </div>
      </main>
    );
  }

  const spotsLeft = preview.maxPlayers - preview.currentPlayers;
  const effectiveStatus = getEffectiveMatchStatus(preview);
  const isFull = effectiveStatus === "FULL";
  const isEnded = effectiveStatus === "FINISHED";
  const isCancelled = effectiveStatus === "CANCELLED";
  const canJoin = effectiveStatus === "OPEN";

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-6 sm:py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Image
            src="/logo.png"
            alt="Raxa"
            width={384}
            height={216}
            className="mx-auto mb-3 h-auto w-44 object-contain sm:w-48"
            sizes="(min-width: 640px) 192px, 176px"
            quality={100}
            priority
          />
          <p className="text-sm text-muted">Você foi convidado para</p>
          <h1 className="mt-1 text-2xl font-extrabold text-text">
            {preview.title}
          </h1>
          <div className="mt-2">
            <StatusBadge status={effectiveStatus} />
          </div>
        </div>

        <section className="mb-6 flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
          <InfoRow icon={<MapPin size={16} />} text={preview.location} />
          <InfoRow
            icon={<CalendarDays size={16} />}
            text={formatMatchDate(preview.scheduledAt)}
          />
          <InfoRow
            icon={<Users size={16} />}
            text={`${preview.currentPlayers}/${preview.maxPlayers} confirmados`}
          />
          {canJoin && (
            <p className="mt-1 text-sm font-medium text-success">
              {spotsLeft} vaga{spotsLeft > 1 ? "s" : ""}{" "}
              {spotsLeft > 1 ? "disponíveis" : "disponível"}
            </p>
          )}
        </section>

        {error && <ErrorMessage className="mb-4" message={error} />}

        <Button
          label={
            isCancelled
              ? "Partida cancelada"
              : isEnded
                ? "Partida encerrada"
                : isFull
                  ? "Partida cheia"
                : "Confirmar presença"
          }
          disabled={!canJoin}
          loading={joinViaInvite.isPending}
          onClick={handleJoin}
          fullWidth
        />

        {isEnded && (
          <p className="mt-3 text-center text-xs text-muted">
            Esta partida já foi realizada e não aceita novas confirmações.
          </p>
        )}

        {!user && canJoin && (
          <p className="mt-3 text-center text-xs text-muted">
            Você precisará fazer login ou criar uma conta para confirmar.
          </p>
        )}
      </div>
    </main>
  );
}
