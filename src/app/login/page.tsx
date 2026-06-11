"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authApi } from "@/api/auth";
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

/**
 * Renders the login page content: logo, email and password form with Zod validation, submission handling, and a registration link.
 *
 * Attempts authentication on submit; on success calls the auth context's signIn and navigates to a safe redirect, on failure displays the API error message.
 *
 * @returns The JSX element for the login page containing email and password inputs, an optional API error message, a submit button, and a link to the registration page.
 */
function LoginContent() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState<string | null>(null);

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
      const response = await authApi.login(data);
      signIn(response);
      router.replace(redirect);
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Erro ao fazer login."));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Raxa"
            width={96}
            height={96}
            className="rounded-xl"
            priority
          />
          <p className="mt-1 text-sm text-muted">Organize sua pelada</p>
        </div>

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
      </div>
    </main>
  );
}

/**
 * Renders the login page UI wrapped in a React Suspense boundary.
 *
 * @returns The login page element.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
