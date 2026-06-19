import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  loadingLabel?: string;
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

/**
 * Render a styled button that supports visual variants, a loading spinner, and optional full-width layout.
 *
 * @param label - Text to display inside the button when not loading
 * @param variant - Visual style to apply; one of `"primary" | "secondary" | "danger" | "ghost"`
 * @param loading - When `true`, shows a spinner and forces the button into a disabled state
 * @param loadingLabel - Optional visible label to show next to the spinner while loading
 * @param disabled - When `true`, disables the button; the button is also disabled when `loading` is `true`
 * @param fullWidth - When `true`, expands the button to full width (`w-full`)
 * @param type - Button `type` attribute (defaults to `"button"`)
 * @param className - Additional CSS class names to append to the computed classes
 * @returns A JSX element representing the configured button
 */
export function Button({
  label,
  variant = "primary",
  loading,
  loadingLabel,
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
          {loadingLabel ? (
            <span className="ml-2">{loadingLabel}</span>
          ) : (
            <span className="sr-only">Carregando</span>
          )}
        </>
      ) : (
        label
      )}
    </button>
  );
}
