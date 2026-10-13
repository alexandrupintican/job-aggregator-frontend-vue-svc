type EnvKeys = "CLIENT_PORT" | "SERVER_PORT" | "VITE_API_URL";

export function getEnvVariable(key: string): string | undefined {
  return import.meta.env[key as EnvKeys];
}
