"use client";

import { Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

/**
 * Renders a widget that displays an invite link and lets the user copy or share it.
 *
 * Builds the invite URL from the current page origin and the provided `inviteCode`, shows the generated link (or a loading placeholder while the origin is determined), provides a copy button that temporarily indicates success, and provides a "share" action that uses the Web Share API when available with a clipboard fallback. Displays a user-facing error message when copy or share fails.
 *
 * @param inviteCode - The invite code appended to "/invite/" to form the invite URL
 * @returns The React element for the invite sharing widget
 */
export function InviteShareWidget({ inviteCode }: { inviteCode: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const inviteUrl = origin ? `${origin}/invite/${inviteCode}` : "";

  const handleCopy = async () => {
    if (!inviteUrl) {
      return;
    }

    setError(null);

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não foi possível copiar o link.");
    }
  };

  const handleShare = async () => {
    if (!inviteUrl) {
      return;
    }

    setError(null);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Raxa - Convite para pelada",
          text: "Confirme sua presença na pelada!",
          url: inviteUrl,
        });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError("Não foi possível compartilhar o convite.");
        return;
      }
    }

    await handleCopy();
  };

  return (
    <section className="mt-4 rounded-xl border border-border bg-surface p-4">
      <p className="mb-2 text-sm font-semibold text-text">Link de convite</p>

      <div className="mb-3 flex items-center gap-2 rounded-lg bg-surface-high px-3 py-2">
        <span className="flex-1 truncate text-xs text-muted">
          {inviteUrl || "Gerando link..."}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!inviteUrl}
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark disabled:opacity-50"
        >
          <Copy size={14} />
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>

      {error && <ErrorMessage className="mb-3" message={error} />}

      <Button
        label="Compartilhar convite"
        variant="secondary"
        onClick={handleShare}
        disabled={!inviteUrl}
        fullWidth
      />
    </section>
  );
}
