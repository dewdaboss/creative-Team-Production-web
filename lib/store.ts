import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import type { GalleryItem, Review, SiteStats, VisitorStats } from "./types";
import { seedGallery, seedReviews, seedStats } from "./seed";
import { kvEnabled, kvGet, kvSet } from "./kv";
import {
  callRpc,
  deleteRows,
  insertRow,
  selectRows,
  supabaseEnabled,
  upsertRows,
} from "./supabase";

/**
 * Unified data store.
 *
 * Priority:
 *  1. Supabase (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) — photo/video gallery,
 *     booking leads, reviews, site stats and visitor counters. Works on Vercel:
 *     everything survives redeploys and cold starts.
 *  2. Upstash Redis (KV_REST_API_*), when configured but Supabase is not.
 *  3. Local JSON files under /data (dev / VPS).
 *
 * Every accessor keeps the same async signature, so callers don't care which
 * backend answered.
 */

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), "ctp-data")
  : path.join(process.cwd(), "data");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

/** In-process write queue so concurrent mutations don't interleave. */
const queues = new Map<string, Promise<unknown>>();

const kvKey = (name: string) => `ctp:${name.replace(/\.json$/, "")}`;

export async function readJSON<T>(name: string, fallback: T): Promise<T> {
  if (kvEnabled && !supabaseEnabled) {
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
    if (kvEnabled && !supabaseEnabled) {
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

/* ---- gallery (JSON fallback only — Supabase lives in lib/gallery.ts) ---- */

export const getGallery = () => readJSON<GalleryItem[]>("gallery.json", seedGallery);
export const saveGallery = (items: GalleryItem[]) => writeJSON("gallery.json", items);

/* ---- reviews ------------------------------------------------------------ */

interface DbReview {
  id: string;
  name: string;
  rating: number;
  text: string;
  service: string | null;
  date: string;
  visible: boolean;
}

const reviewFromDb = (r: DbReview): Review => ({
  id: r.id,
  name: r.name,
  rating: r.rating,
  text: r.text,
  service: r.service ?? undefined,
  date: r.date,
  visible: r.visible,
});

const reviewToDb = (r: Review) => ({
  id: r.id,
  name: r.name,
  rating: r.rating,
  text: r.text,
  service: r.service ?? null,
  date: r.date,
  visible: r.visible,
});

let reviewsSeeded = false;

export async function getReviews(): Promise<Review[]> {
  if (supabaseEnabled) {
    try {
      const rows = await selectRows<DbReview>("reviews", "select=*&order=date.desc");
      if (rows.length > 0) return rows.map(reviewFromDb);
      // Fresh project → seed the built-in reviews once so the section isn't empty.
      if (!reviewsSeeded) {
        reviewsSeeded = true;
        await upsertRows("reviews", seedReviews.map(reviewToDb), "id").catch(() => undefined);
      }
      return seedReviews;
    } catch (e) {
      console.error("supabase reviews read failed — using JSON store", e);
    }
  }
  return readJSON<Review[]>("reviews.json", seedReviews);
}

export async function saveReviews(items: Review[]): Promise<void> {
  if (supabaseEnabled) {
    try {
      if (items.length > 0) {
        await upsertRows("reviews", items.map(reviewToDb), "id");
      }
      const existing = await selectRows<{ id: string }>("reviews", "select=id");
      const keep = new Set(items.map((i) => i.id));
      const drop = existing.map((e) => e.id).filter((id) => !keep.has(id));
      if (drop.length > 0) {
        await deleteRows("reviews", `id=in.(${drop.map((id) => encodeURIComponent(id)).join(",")})`);
      }
      return;
    } catch (e) {
      console.error("supabase reviews write failed — using JSON store", e);
    }
  }
  await writeJSON("reviews.json", items);
}

/* ---- site stats --------------------------------------------------------- */

interface DbStats {
  id: number;
  instagram_followers: number;
  followers_today: number;
  projects_delivered: number;
  happy_clients: number;
  reels_produced: number;
  updated_at: string;
}

const statsFromDb = (r: DbStats): SiteStats => ({
  instagramFollowers: r.instagram_followers,
  followersToday: r.followers_today,
  projectsDelivered: r.projects_delivered,
  happyClients: r.happy_clients,
  reelsProduced: r.reels_produced,
  updatedAt: r.updated_at,
});

const statsToDb = (s: SiteStats) => ({
  id: 1,
  instagram_followers: s.instagramFollowers,
  followers_today: s.followersToday,
  projects_delivered: s.projectsDelivered,
  happy_clients: s.happyClients,
  reels_produced: s.reelsProduced,
  updated_at: s.updatedAt,
});

export async function getStats(): Promise<SiteStats> {
  if (supabaseEnabled) {
    try {
      const rows = await selectRows<DbStats>("site_stats", "select=*&id=eq.1");
      if (rows[0]) return statsFromDb(rows[0]);
      await upsertRows("site_stats", [statsToDb(seedStats)], "id").catch(() => undefined);
      return seedStats;
    } catch (e) {
      console.error("supabase stats read failed — using JSON store", e);
    }
  }
  return readJSON<SiteStats>("stats.json", seedStats);
}

export async function saveStats(s: SiteStats): Promise<void> {
  if (supabaseEnabled) {
    try {
      await upsertRows("site_stats", [statsToDb(s)], "id");
      return;
    } catch (e) {
      console.error("supabase stats write failed — using JSON store", e);
    }
  }
  await writeJSON("stats.json", s);
}

/* ---- visitor counter ---------------------------------------------------- */

interface DbVisitors {
  id: number;
  total: number | string;
  today: number;
  day: string;
}

const visitorsFromDb = (r: DbVisitors): VisitorStats => ({
  total: Number(r.total),
  today: r.today,
  day: r.day,
});

const EMPTY_VISITORS: VisitorStats = { total: 0, today: 0, day: "" };

export async function getVisitors(): Promise<VisitorStats> {
  if (supabaseEnabled) {
    try {
      const rows = await selectRows<DbVisitors>("visitor_counters", "select=*&id=eq.1");
      return rows[0] ? visitorsFromDb(rows[0]) : EMPTY_VISITORS;
    } catch (e) {
      console.error("supabase visitor read failed — using JSON store", e);
    }
  }
  return readJSON<VisitorStats>("stats-runtime.json", EMPTY_VISITORS);
}

export async function saveVisitors(v: VisitorStats): Promise<void> {
  if (supabaseEnabled) {
    try {
      await upsertRows("visitor_counters", [{ id: 1, total: v.total, today: v.today, day: v.day }], "id");
      return;
    } catch (e) {
      console.error("supabase visitor write failed — using JSON store", e);
    }
  }
  await writeJSON("stats-runtime.json", v);
}

/**
 * Counts one visit. On Supabase this uses the atomic `increment_visitor()`
 * function, so parallel visitors never overwrite each other's counts.
 */
export async function recordVisit(day: string): Promise<VisitorStats> {
  if (supabaseEnabled) {
    try {
      const result = await callRpc<DbVisitors | DbVisitors[]>("increment_visitor", { p_day: day });
      const row = Array.isArray(result) ? result[0] : result;
      if (row) return visitorsFromDb(row);
    } catch (e) {
      console.error("supabase visitor increment failed — falling back", e);
    }
  }
  const current = await getVisitors();
  const next = {
    total: current.total + 1,
    today: current.day === day ? current.today + 1 : 1,
    day,
  };
  await saveVisitors(next);
  return next;
}

/* ---- booking leads ------------------------------------------------------ */

export interface LeadRecord {
  [key: string]: unknown;
}

export async function getLeads(): Promise<LeadRecord[]> {
  if (supabaseEnabled) {
    try {
      const rows = await selectRows<{ payload: LeadRecord }>(
        "leads",
        "select=payload&order=created_at.desc&limit=500"
      );
      return rows.map((r) => r.payload);
    } catch (e) {
      console.error("supabase leads read failed — using JSON store", e);
    }
  }
  return readJSON<LeadRecord[]>("leads.json", []);
}

export async function appendLead(lead: LeadRecord): Promise<void> {
  const id = typeof lead.id === "string" && lead.id ? lead.id : randomUUID();
  const createdAt = typeof lead.createdAt === "string" ? lead.createdAt : new Date().toISOString();
  const payload = { ...lead, id, createdAt };

  if (supabaseEnabled) {
    try {
      await insertRow("leads", { id, created_at: createdAt, payload });
      return;
    } catch (e) {
      console.error("supabase lead insert failed — using JSON store", e);
    }
  }

  const leads = await readJSON<LeadRecord[]>("leads.json", []);
  leads.unshift(payload);
  await writeJSON("leads.json", leads.slice(0, 1000));
}
