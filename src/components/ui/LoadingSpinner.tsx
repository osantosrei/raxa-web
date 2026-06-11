import { Spinner } from "@/components/ui/Spinner";

export function LoadingSpinner() {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <Spinner className="h-6 w-6" />
      <span className="sr-only" role="status" aria-live="polite">
        Carregando
      </span>
    </div>
  );
}
