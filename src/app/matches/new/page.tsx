"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { toApiDateTime } from "@/lib/utils";
import { useCreateMatch } from "@/hooks/useMatches";

const matchSchema = z
  .object({
    title: z.string().min(3, "Mínimo 3 caracteres").max(100),
    location: z.string().min(3, "Local obrigatório"),
    date: z.string().min(1, "Data obrigatória"),
    time: z.string().min(1, "Horário obrigatório"),
    maxPlayers: z.coerce.number().min(2, "Mínimo 2").max(100),
  })
  .refine(
    (data) => {
      const scheduledAt = new Date(`${data.date}T${data.time}:00`);
      return !Number.isNaN(scheduledAt.getTime()) && scheduledAt > new Date();
    },
    {
      message: "A data precisa ser futura",
      path: ["date"],
    },
  );

type MatchFormInput = z.input<typeof matchSchema>;
type MatchFormValues = z.output<typeof matchSchema>;

/**
 * Extracts a message from an error-like object or returns a fallback message.
 *
 * @param err - The value to inspect for a `message` property; may be any value.
 * @param fallback - Message to return when `err` does not contain a `message`.
 * @returns The `message` string from `err` if present, otherwise `fallback`.
 */
function getApiErrorMessage(err: unknown, fallback: string) {
  return err && typeof err === "object" && "message" in err
    ? String(err.message)
    : fallback;
}

/**
 * Render the "New Match" page containing a form to create a match.
 *
 * The component displays inputs for title, location, date, time and max players,
 * shows field validation and API errors, and handles form submission to create
 * a match and navigate to the created match on success.
 *
 * @returns The React element for the new-match page and form UI.
 */
export default function NewMatchPage() {
  const router = useRouter();
  const createMatch = useCreateMatch();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MatchFormInput, unknown, MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      maxPlayers: 10,
    },
  });

  const onSubmit = async (data: MatchFormValues) => {
    setApiError(null);

    try {
      const scheduledAt = new Date(`${data.date}T${data.time}:00`);
      const match = await createMatch.mutateAsync({
        title: data.title,
        location: data.location,
        scheduledAt: toApiDateTime(scheduledAt),
        maxPlayers: data.maxPlayers,
      });

      router.push(`/matches/${match.id}`);
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Erro ao criar partida."));
    }
  };

  return (
    <main className="mx-auto max-w-lg px-4 pb-24">
      <Link
        href="/matches"
        className="flex items-center gap-1 py-4 text-sm text-muted"
      >
        <ChevronLeft size={16} /> Voltar
      </Link>

      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-text">Nova pelada</h1>
        <p className="mt-1 text-sm text-muted">
          Preencha os dados para convidar a galera.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Título"
          placeholder="Pelada de quinta"
          error={errors.title?.message}
          {...register("title")}
        />
        <Input
          label="Local"
          placeholder="Arena, quadra ou endereço"
          error={errors.location?.message}
          {...register("location")}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Data"
            type="date"
            error={errors.date?.message}
            {...register("date")}
          />
          <Input
            label="Horário"
            type="time"
            error={errors.time?.message}
            {...register("time")}
          />
        </div>
        <Input
          label="Máximo de jogadores"
          type="number"
          min={2}
          max={100}
          error={errors.maxPlayers?.message}
          {...register("maxPlayers")}
        />

        {apiError && <ErrorMessage message={apiError} />}

        <Button
          label="Criar partida"
          type="submit"
          loading={isSubmitting || createMatch.isPending}
          fullWidth
        />
      </form>
    </main>
  );
}
