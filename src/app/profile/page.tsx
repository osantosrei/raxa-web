"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonClassName } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { normalizePhone, optionalPhoneSchema } from "@/lib/validation";
import { useAuth } from "@/store/authContext";

const profileSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  phone: optionalPhoneSchema,
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
    formState: { errors, isDirty, isSubmitting },
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
        phone: normalizePhone(data.phone),
      });

      updateUser(updatedUser);
      reset({
        name: updatedUser.name,
        phone: updatedUser.phone ?? "",
      });
      setSuccessMessage("Perfil atualizado.");
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Erro ao atualizar perfil."));
    }
  };

  if (isLoading && !profile) {
    return <LoadingSpinner />;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="py-5">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">Perfil</h1>
      </div>

      <section className="mb-5 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-high text-primary">
            <UserRound size={24} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold text-text">
              {profile?.name ?? user?.name}
            </p>
            <p className="truncate text-sm text-muted">
              {profile?.email ?? user?.email}
            </p>
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
          placeholder="(11) 99999-9999"
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
          disabled={!isDirty}
          fullWidth
        />
      </form>

      <div className="mt-8 border-t border-border pt-5">
        <button
          type="button"
          onClick={signOut}
          className={buttonClassName({
            variant: "secondary",
            fullWidth: true,
            className: "gap-2",
          })}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </main>
  );
}
