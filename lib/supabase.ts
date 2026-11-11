/**
 * SERVER-ONLY Supabase helpers — zero dependency REST client.
 *
 * Uses the service-role secret key, so this module must only ever be imported
 * from server code (route handlers, server components, lib/*). Never import it
 * from a "use client" component — use `lib/site.ts` / props instead.
 *
 * Configure with:
 *   SUPABASE_URL=https://<project-ref>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<service_role key>
 *   SUPABASE_STORAGE_BUCKET=gallery   (optional)
 */

const rawUrl = process.env.SUPABASE_URL ?? "";
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const SUPABASE_URL = rawUrl.replace(/\/$/, "");
export const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "gallery";

/** True when Supabase credentials are present — otherwise the app falls back to the local JSON store. */
export const supabaseEnabled = Boolean(SUPABASE_URL && rawKey);

export class SupabaseError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!supabaseEnabled) throw new SupabaseError("Supabase is not configured.", 503);

  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: rawKey,
      Authorization: `Bearer ${rawKey}`,
      ...(init.headers ?? {}),
    },
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const detail =
      data && typeof data === "object"
        ? ((data as { message?: string; error?: string }).message ??
          (data as { error?: string }).error ??
          JSON.stringify(data))
        : typeof data === "string"
          ? data
          : "";
    throw new SupabaseError(`Supabase ${res.status}: ${detail}`, res.status);
  }

  return data as T;
}

/* ---- PostgREST (database) ---------------------------------------------- */

export function selectRows<T>(table: string, search = ""): Promise<T[]> {
  const qs = search ? `?${search}` : "";
  return request<T[]>(`/rest/v1/${table}${qs}`);
}

export function insertRow<T>(table: string, row: Record<string, unknown>): Promise<T[]> {
  return request<T[]>(`/rest/v1/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
}

export function updateRows<T>(
  table: string,
  filter: string,
  patch: Record<string, unknown>
): Promise<T[]> {
  return request<T[]>(`/rest/v1/${table}?${filter}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
}

/** Bulk insert-or-update on a unique column (used for single-row settings + review sync). */
export function upsertRows<T>(
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string
): Promise<T[]> {
  return request<T[]>(`/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  });
}

/** Calls a Postgres function exposed through PostgREST (e.g. atomic counters). */
export function callRpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  return request<T>(`/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
}

export function deleteRows(table: string, filter: string): Promise<null> {
  return request<null>(`/rest/v1/${table}?${filter}`, { method: "DELETE" });
}

/* ---- Storage ------------------------------------------------------------ */

/** Public URL for an object inside the media bucket. */
export function publicObjectUrl(objectPath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${objectPath}`;
}

export async function uploadObject(
  objectPath: string,
  file: File | Blob,
  contentType: string
): Promise<string> {
  await request<unknown>(`/storage/v1/object/${SUPABASE_STORAGE_BUCKET}/${objectPath}`, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      "x-upsert": "true",
      "cache-control": "public, max-age=31536000, immutable",
    },
    body: file,
  });
  return publicObjectUrl(objectPath);
}

export async function removeObjects(objectPaths: string[]): Promise<void> {
  if (objectPaths.length === 0) return;
  await request<unknown>(`/storage/v1/object/${SUPABASE_STORAGE_BUCKET}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prefixes: objectPaths }),
  });
}

/** Extracts the in-bucket object path from a Supabase public URL (null when external). */
export function objectPathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}
