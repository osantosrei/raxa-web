import { CalendarDays, Trophy, Users, type LucideIcon } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
}

const onboardingItems: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Users, label: "Chame a galera" },
  { icon: CalendarDays, label: "Marque a pelada" },
  { icon: Trophy, label: "Confirme o time" },
];

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-4">
      <div className="w-full max-w-md">
        <section className="mb-6 flex flex-col items-center text-center">
          <h1 className="sr-only">Raxa</h1>
          <Image
            src="/logo.png"
            alt="Raxa"
            width={256}
            height={144}
            className="h-auto w-64 object-contain sm:w-72"
            priority
          />
          <p className="mt-3 text-base font-medium text-muted">
            Junte os amigos. Marque uma pelada.
          </p>

          <div className="mt-5 flex w-full flex-wrap justify-center gap-2">
            {onboardingItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-semibold text-text"
              >
                <Icon size={15} className="text-primary" strokeWidth={2.2} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
          {children}
        </section>
      </div>
    </main>
  );
}
