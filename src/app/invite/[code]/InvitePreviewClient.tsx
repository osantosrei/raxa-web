"use client";

import { CalendarDays, MapPin, Users } from "lucide-react";
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
import { formatMatchDate } from "@/lib/utils";
import { useAuth } from "@/store/authContext";

interface InvitePreviewClientProps {
  code: string;
}

function getApiErrorMessage(err: unknown, fallback: string) {
  return err && typeof err === "object" && "message" in err
    ? String(err.message)
    : fallback;
}

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
            icon="🔗"
            title="Convite inválido"
            description="Este convite não existe ou foi desativado."
          />
        </div>
      </main>
    );
  }

  const spotsLeft = preview.maxPlayers - preview.currentPlayers;
  const isFull = preview.status === "FULL";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Image
            src="/logo.png"
            alt="Raxa"
            width={48}
            height={48}
            className="mx-auto mb-2 rounded-xl"
            priority
          />
          <p className="text-sm text-muted">Você foi convidado para</p>
          <h1 className="mt-1 text-2xl font-extrabold text-text">
            {preview.title}
          </h1>
          <div className="mt-2">
            <StatusBadge status={preview.status} />
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
          {!isFull && (
            <p className="mt-1 text-sm font-medium text-success">
              {spotsLeft} vaga{spotsLeft > 1 ? "s" : ""}{" "}
              {spotsLeft > 1 ? "disponíveis" : "disponível"}
            </p>
          )}
        </section>

        {error && <ErrorMessage className="mb-4" message={error} />}

        <Button
          label={isFull ? "Partida cheia" : "Confirmar presença"}
          disabled={isFull}
          loading={joinViaInvite.isPending}
          onClick={handleJoin}
          fullWidth
        />

        {!user && !isFull && (
          <p className="mt-3 text-center text-xs text-muted">
            Você precisará fazer login ou criar uma conta para confirmar.
          </p>
        )}
      </div>
    </main>
  );
}
