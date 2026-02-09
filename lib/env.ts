const DEFAULT_APP_URL = "http://localhost:3000";

export function getAppUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "";
  const normalized = raw.replace(/\/+$/, "");
  const candidate = normalized || DEFAULT_APP_URL;

  try {
    return new URL(candidate);
  } catch {
    return new URL(DEFAULT_APP_URL);
  }
}
