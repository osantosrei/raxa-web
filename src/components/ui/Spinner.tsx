import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  borderClass?: string;
}

export function Spinner({
  className,
  borderClass = "border-primary",
}: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "h-4 w-4 animate-spin rounded-full border-2 border-t-transparent",
        borderClass,
        className,
      )}
    />
  );
}
