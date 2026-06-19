"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authApi } from "@/api/auth";
import { ApiWakeError, API_WAKING_MESSAGE, wakeApi } from "@/api/health";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { getApiErrorMessage } from "@/lib/errors";
import { getSafeRedirectPath } from "@/lib/navigation";
import { useAuth } from "@/store/authContext";
import type { LoginRequest } from "@/types/api";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

function LoginContent() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isWakingApi, setIsWakingApi] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });
  const redirect = getSafeRedirectPath(searchParams.get("redirect"));
  const registerHref =
    redirect === "/matches"
      ? "/register"
      : `/register?redirect=${encodeURIComponent(redirect)}`;

  const onSubmit = async (data: LoginRequest) => {
    setApiError(null);

    try {
      setIsWakingApi(true);
      setApiError(API_WAKING_MESSAGE);
      await wakeApi();
      setIsWakingApi(false);
      setApiError(null);

      const response = await authApi.login(data);
      signIn(response);
      router.replace(redirect);
    } catch (err) {
      setApiError(
        err instanceof ApiWakeError
          ? err.message
          : getApiErrorMessage(err, "Erro ao fazer login."),
      );
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {apiError && <ErrorMessage message={apiError} />}

        <Button
          label="Entrar"
          type="submit"
          loading={isSubmitting}
          loadingLabel={isWakingApi ? "Servidor iniciando..." : undefined}
          fullWidth
        />
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Não tem conta?{" "}
        <Link
          href={registerHref}
          className="font-medium text-primary hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
