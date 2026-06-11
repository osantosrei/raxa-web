/**
 * Renders a centered circular loading indicator styled with Tailwind CSS.
 *
 * @returns A JSX element containing a centered, animated spinner with a primary-colored border and a transparent top segment.
 */
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
