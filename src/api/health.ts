import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

const REQUEST_TIMEOUT_MS = 8000;
const MAX_WAKE_WAIT_MS = 70000;
const BACKOFF_DELAYS_MS = [1000, 2000, 3000, 5000, 8000, 10000];

export const API_WAKING_MESSAGE =
  "Servidor iniciando... isso pode levar alguns segundos.";
export const API_WAKE_FAILED_MESSAGE =
  "Servidor ainda está iniciando. Aguarde alguns instantes e tente novamente.";
export const REGISTER_CONFIRMATION_UNKNOWN_MESSAGE =
  "A solicitação de cadastro foi enviada, mas não conseguimos confirmar a resposta. Se a conta já tiver sido criada, tente entrar com seu e-mail e senha.";

export class ApiWakeError extends Error {
  constructor() {
    super(API_WAKE_FAILED_MESSAGE);
    this.name = "ApiWakeError";
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getBackoffDelay(attempt: number) {
  return BACKOFF_DELAYS_MS[Math.min(attempt, BACKOFF_DELAYS_MS.length - 1)];
}

export async function wakeApi() {
  const deadline = Date.now() + MAX_WAKE_WAIT_MS;
  let attempt = 0;

  while (Date.now() < deadline) {
    try {
      await axios.get("/health", {
        baseURL: API_BASE_URL,
        timeout: REQUEST_TIMEOUT_MS,
      });
      return;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return;
      }

      const delay = Math.min(getBackoffDelay(attempt), deadline - Date.now());

      if (delay <= 0) {
        break;
      }

      attempt += 1;
      await sleep(delay);
    }
  }

  throw new ApiWakeError();
}
