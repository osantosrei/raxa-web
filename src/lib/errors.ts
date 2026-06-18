export function getApiErrorMessage(err: unknown, fallback: string) {
  return err && typeof err === "object" && "message" in err
    ? String(err.message)
    : fallback;
}

export function isApiConnectionError(err: unknown) {
  return (
    err !== null &&
    typeof err === "object" &&
    "isConnectionError" in err &&
    err.isConnectionError === true
  );
}
