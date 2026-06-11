import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

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
  danger: "bg-danger text-white hover:bg-red-700",
  ghost: "bg-transparent text-primary hover:text-primary-dark",
};

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
      disabled={disabled || loading}
      className={cn(
        "flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold transition-all",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        label
      )}
    </button>
  );
}
