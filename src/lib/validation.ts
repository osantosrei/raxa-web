import { z } from "zod";

export function normalizePhone(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.replace(/[()\s.-]/g, "");
}

export function isValidPhone(value?: string | null) {
  const normalized = normalizePhone(value);

  if (!normalized) {
    return true;
  }

  if (!/^\+?\d+$/.test(normalized)) {
    return false;
  }

  const digits = normalized.replace(/^\+/, "");

  return digits.length >= 10 && digits.length <= 15;
}

export const optionalPhoneSchema = z
  .string()
  .optional()
  .refine(isValidPhone, { message: "Telefone inválido" });
