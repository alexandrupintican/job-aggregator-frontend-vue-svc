import { ApiException } from "@/client/job-aggregator-svc";

type EnvKeys = "CLIENT_PORT" | "SERVER_PORT" | "VITE_API_URL";

export function getEnvVariable(key: string): string | undefined {
  return import.meta.env[key as EnvKeys];
}

/** Prefers the server's `{ "error": "..." }` text over the generated client's generic message. */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (ApiException.isApiException(err)) {
    try {
      const body = JSON.parse(err.response) as { error?: unknown };
      if (typeof body.error === "string") return body.error;
    } catch {
      // Not JSON; fall through to the client's message.
    }
    return err.message;
  }
  return err instanceof Error ? err.message : fallback;
}
