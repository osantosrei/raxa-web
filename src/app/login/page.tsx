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
import { useAuth } from "@/store/authContext";
import type { LoginRequest } from "@/types/api";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

function getSafeRedirectPath(redirect: string | null) {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return "/matches";
  }

  return redirect;
}

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

  const onSubmit = async (data: LoginRequest) => {
    setApiError(null);

    try {
      const response = await authApi.login(data);
      signIn(response);
      router.replace(getSafeRedirectPath(searchParams.get("redirect")));
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Erro ao fazer login.";
      setApiError(message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Raxa"
            width={64}
            height={64}
            className="rounded-xl"
            priority
          />
          <h1 className="mt-2 font-outfit text-4xl font-extrabold text-primary">
            raxa
          </h1>
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
          <Link href="/register" className="font-medium text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
