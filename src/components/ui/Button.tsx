import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary:
    "border border-border bg-surface-high text-text hover:bg-border",
  danger: "bg-danger text-white hover:bg-danger/90",
  ghost: "bg-transparent text-primary hover:text-primary-dark",
};

export function buttonClassName({
  variant = "primary",
  fullWidth,
  className,
}: Pick<ButtonProps, "variant" | "fullWidth" | "className"> = {}) {
  return cn(
    "flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold transition-all",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    fullWidth && "w-full",
    className,
  );
}

export function Button({
  label,
  variant = "primary",
  loading,
  disabled,
  fullWidth,
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={buttonClassName({ variant, fullWidth, className })}
      {...props}
    >
      {loading ? (
        <>
          <Spinner borderClass="border-current" />
          <span className="sr-only">Carregando</span>
        </>
      ) : (
        label
      )}
    </button>
  );
}
