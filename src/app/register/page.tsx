"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authApi } from "@/api/auth";
import { invitesApi } from "@/api/invites";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import {
  getInviteCodeFromRedirect,
  getSafeRedirectPath,
} from "@/lib/navigation";
import { normalizePhone, optionalPhoneSchema } from "@/lib/validation";
import { useAuth } from "@/store/authContext";
import type { RegisterRequest } from "@/types/api";

const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  phone: optionalPhoneSchema,
});

function getApiErrorMessage(err: unknown, fallback: string) {
  return err && typeof err === "object" && "message" in err
    ? String(err.message)
    : fallback;
}

function RegisterContent() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const redirect = getSafeRedirectPath(searchParams.get("redirect"));
  const loginHref =
    redirect === "/matches"
      ? "/login"
      : `/login?redirect=${encodeURIComponent(redirect)}`;

  const onSubmit = async (data: RegisterRequest) => {
    setApiError(null);

    try {
      const response = await authApi.register({
        ...data,
        phone: normalizePhone(data.phone),
      });
      signIn(response);

      const inviteCode = getInviteCodeFromRedirect(redirect);

      if (inviteCode) {
        const match = await invitesApi.join(inviteCode);
        router.replace(`/matches/${match.id}`);
        return;
      }

      router.replace(redirect);
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Erro ao criar conta."));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
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
          <p className="mt-2 text-sm text-muted">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nome"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Telefone"
            type="tel"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          {apiError && <ErrorMessage message={apiError} />}

          <Button
            label="Cadastrar"
            type="submit"
            loading={isSubmitting}
            fullWidth
          />
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link
            href={loginHref}
            className="font-medium text-primary hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
