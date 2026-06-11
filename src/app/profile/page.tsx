"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/store/authContext";

const profileSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || value.trim().length > 0, {
      message: "Telefone inválido",
    }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function getApiErrorMessage(err: unknown, fallback: string) {
  return err && typeof err === "object" && "message" in err
    ? String(err.message)
    : fallback;
}

export default function ProfilePage() {
  const { user, signOut, updateUser } = useAuth();
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const updateProfile = useUpdateProfile();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        phone: profile.phone ?? "",
      });
      updateUser(profile);
    }
  }, [profile, reset, updateUser]);

  const onSubmit = async (data: ProfileFormValues) => {
    setApiError(null);
    setSuccessMessage(null);

    try {
      const updatedUser = await updateProfile.mutateAsync({
        name: data.name,
        phone: data.phone?.trim() || undefined,
      });

      updateUser(updatedUser);
      setSuccessMessage("Perfil atualizado.");
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Erro ao atualizar perfil."));
    }
  };

  if (isLoading && !profile) {
    return <LoadingSpinner />;
  }

  return (
    <main className="mx-auto max-w-lg px-4 pb-24">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-xl font-bold text-text">Perfil</h1>
          <p className="text-sm text-muted">Dados da sua conta</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-text"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>

      <section className="mb-5 rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-high text-primary">
            <UserRound size={24} />
          </div>
          <div>
            <p className="font-bold text-text">{profile?.name ?? user?.name}</p>
            <p className="text-sm text-muted">{profile?.email ?? user?.email}</p>
          </div>
        </div>
      </section>

      {isError && (
        <ErrorMessage
          className="mb-4"
          message="Erro ao carregar perfil."
          onRetry={() => refetch()}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nome"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Telefone"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />

        {apiError && <ErrorMessage message={apiError} />}
        {successMessage && (
          <div className="rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
            {successMessage}
          </div>
        )}

        <Button
          label="Salvar alterações"
          type="submit"
          loading={isSubmitting || updateProfile.isPending}
          fullWidth
        />
      </form>
    </main>
  );
}
