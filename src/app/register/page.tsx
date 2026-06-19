"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authApi } from "@/api/auth";
import {
  ApiWakeError,
  API_WAKING_MESSAGE,
  REGISTER_CONFIRMATION_UNKNOWN_MESSAGE,
  wakeApi,
} from "@/api/health";
import { invitesApi } from "@/api/invites";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { getApiErrorMessage, isApiConnectionError } from "@/lib/errors";
import {
  getInviteCodeFromRedirect,
  getSafeRedirectPath,
} from "@/lib/navigation";
import { useAuth } from "@/store/authContext";

const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function getDefaultNameFromEmail(email: string) {
  const localPart = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();

  return localPart && localPart.length >= 2 ? localPart : email;
}

function RegisterContent() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState<string | null>(null);
  const [inviteWarning, setInviteWarning] = useState<string | null>(null);
  const [isWakingApi, setIsWakingApi] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const redirect = getSafeRedirectPath(searchParams.get("redirect"));
  const loginHref =
    redirect === "/matches"
      ? "/login"
      : `/login?redirect=${encodeURIComponent(redirect)}`;

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError(null);
    setInviteWarning(null);
    let registerSubmitted = false;

    try {
      setIsWakingApi(true);
      setApiError(API_WAKING_MESSAGE);
      await wakeApi();
      setIsWakingApi(false);
      setApiError(null);

      registerSubmitted = true;
      const response = await authApi.register(data);
      signIn(response);

      const inviteCode = getInviteCodeFromRedirect(redirect);

      if (inviteCode) {
        try {
          const match = await invitesApi.join(inviteCode);
          router.replace(`/matches/${match.id}`);
        } catch {
          setInviteWarning(
            "Conta criada, mas não foi possível entrar pelo convite. Você será redirecionado para as peladas.",
          );
          window.setTimeout(() => router.replace("/matches"), 1800);
        }
        return;
      }

      router.replace(redirect);
    } catch (err) {
      if (err instanceof ApiWakeError) {
        setApiError(err.message);
      } else if (registerSubmitted && isApiConnectionError(err)) {
        setApiError(REGISTER_CONFIRMATION_UNKNOWN_MESSAGE);
      } else {
        setApiError(getApiErrorMessage(err, "Erro ao criar conta."));
      }
    } finally {
      setIsWakingApi(false);
    }
  };

  return (
    <AuthShell>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {apiError && <ErrorMessage message={apiError} />}
        {inviteWarning && (
          <div className="rounded-xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">
            {inviteWarning}
          </div>
        )}

        <Button
          label="Cadastrar"
          type="submit"
          loading={isSubmitting}
          loadingLabel={isWakingApi ? "Servidor iniciando..." : undefined}
          fullWidth
        />
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href={loginHref} className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
