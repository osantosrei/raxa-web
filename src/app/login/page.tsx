"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Trophy, Users } from "lucide-react";
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

const onboardingItems = [
  {
    icon: Users,
    title: "Chame a galera",
    description: "Compartilhe o convite em segundos.",
  },
  {
    icon: CalendarDays,
    title: "Marque o horário",
    description: "Data, local e vagas em um só lugar.",
  },
  {
    icon: Trophy,
    title: "Confirme o time",
    description: "Todo mundo vê quem já está dentro.",
  },
];

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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Raxa"
            width={144}
            height={144}
            className="h-32 w-32 rounded-2xl object-cover sm:h-36 sm:w-36"
            priority
          />
          <p className="mt-3 text-base font-medium text-muted">
            Junte os amigos. Marque uma pelada.
          </p>

          <div className="mt-8 grid w-full gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {onboardingItems.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-xl border border-border bg-surface p-4 text-left"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <h2 className="text-sm font-bold text-text">{title}</h2>
                <p className="mt-1 text-sm text-muted">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
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
        </section>
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
