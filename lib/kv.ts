/**
 * Zero-dependency Upstash Redis REST client.
 *
 * Enabled automatically when KV_REST_API_URL + KV_REST_API_TOKEN are set
 * (Upstash free tier — see DEPLOY.md). Lets the JSON store persist on
 * serverless hosts (e.g. Vercel) where the filesystem is read-only.
 */

const url = process.env.KV_REST_API_URL ?? "";
const token = process.env.KV_REST_API_TOKEN ?? "";

export const kvEnabled = Boolean(url && token);

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${url}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`KV request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const data = await call<{ result: string | null }>(`/get/${encodeURIComponent(key)}`);
  if (data.result == null) return null;
  try {
    return JSON.parse(data.result) as T;
  } catch {
    return null;
  }
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  await call(`/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(JSON.stringify(value)),
  });
}
