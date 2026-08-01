import { promises as fs } from "fs";
import path from "path";
import type { GalleryItem, Review, SiteStats, VisitorStats } from "./types";
import { seedGallery, seedReviews, seedStats } from "./seed";
import { kvEnabled, kvGet, kvSet } from "./kv";

/**
 * Unified JSON store.
 *  - Local dev / VPS   → flat files under /data
 *  - Serverless (Vercel) → Upstash Redis (auto-enabled via KV_REST_API_* env)
 * Same async interface either way — callers don't care which backend is live.
 */

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

/** In-process write queue so concurrent mutations don't interleave. */
const queues = new Map<string, Promise<unknown>>();

const kvKey = (name: string) => `ctp:${name.replace(/\.json$/, "")}`;

export async function readJSON<T>(name: string, fallback: T): Promise<T> {
  if (kvEnabled) {
    const hit = await kvGet<T>(kvKey(name)).catch(() => null);
    if (hit !== null) return hit;
    await writeJSON(name, fallback);
    return fallback;
  }
  await ensureDir();
  const file = path.join(DATA_DIR, name);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    await writeJSON(name, fallback);
    return fallback;
  }
}

export function writeJSON(name: string, data: unknown): Promise<void> {
  const prev = queues.get(name) ?? Promise.resolve();
  const next = prev.then(async () => {
    if (kvEnabled) {
      await kvSet(kvKey(name), data);
      return;
    }
    await ensureDir();
    const file = path.join(DATA_DIR, name);
    const tmp = file + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tmp, file);
  });
  queues.set(name, next.catch(() => {}));
  return next;
}

/* ---- typed accessors ---------------------------------------------------- */

export const getGallery = () => readJSON<GalleryItem[]>("gallery.json", seedGallery);
export const saveGallery = (items: GalleryItem[]) => writeJSON("gallery.json", items);

export const getReviews = () => readJSON<Review[]>("reviews.json", seedReviews);
export const saveReviews = (items: Review[]) => writeJSON("reviews.json", items);

export const getStats = () => readJSON<SiteStats>("stats.json", seedStats);
export const saveStats = (s: SiteStats) => writeJSON("stats.json", s);

export const getVisitors = () =>
  readJSON<VisitorStats>("stats-runtime.json", { total: 0, today: 0, day: "" });
export const saveVisitors = (v: VisitorStats) => writeJSON("stats-runtime.json", v);

export interface LeadRecord {
  [key: string]: unknown;
}
export const getLeads = () => readJSON<LeadRecord[]>("leads.json", []);
export const appendLead = async (lead: LeadRecord) => {
  const leads = await getLeads();
  leads.unshift(lead);
  await writeJSON("leads.json", leads.slice(0, 1000));
};
