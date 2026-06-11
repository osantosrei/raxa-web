import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text">{label}</label>
      <input
        ref={ref}
        className={cn(
          "rounded-xl border bg-surface-high px-4 py-3 text-sm text-text outline-none transition-colors",
          "placeholder:text-muted focus:border-primary",
          error ? "border-danger" : "border-border",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  ),
);

Input.displayName = "Input";
