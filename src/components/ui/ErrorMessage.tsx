import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
  onRetry?: () => void;
}

/**
 * Renders a styled error alert with an icon, the provided message, and an optional retry button.
 *
 * @param message - Text to display inside the alert
 * @param className - Additional CSS classes appended to the root container
 * @param onRetry - If provided, a "Tentar novamente" button is shown and this callback is invoked when the button is clicked
 * @returns A JSX element containing the error alert UI
 */
export function ErrorMessage({
  message,
  className,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger",
        className,
      )}
    >
      <AlertCircle size={16} className="shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="font-bold text-danger hover:text-red-300"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
