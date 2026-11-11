import { randomUUID } from "crypto";
import { getGallery, saveGallery } from "./store";
import { seedGallery } from "./seed";
import { DEFAULT_ROW } from "./gallery-rows";
import type { GalleryItem, GalleryMediaType, GalleryRowKey } from "./types";
import {
  deleteRows,
  insertRow,
  objectPathFromUrl,
  removeObjects,
  selectRows,
  supabaseEnabled,
  updateRows,
  uploadObject,
} from "./supabase";

/**
 * Gallery data layer.
 *
 *  - Supabase configured  → `gallery_items` table + `gallery` storage bucket
 *                           (photos, videos and row placement, live on Vercel)
 *  - not configured       → existing local JSON store (dev / self-hosting)
 *
 * Server-only: imported from route handlers and server components.
 */

const TABLE = "gallery_items";

export const usingSupabase = supabaseEnabled;

interface DbRow {
  id: string;
  type: "photo" | "reel";
  title: string;
  category: string;
  media_type: GalleryMediaType;
  src: string;
  embed_url: string | null;
  views: string | null;
  duration: string | null;
  row_key: GalleryRowKey;
  visible: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

function fromDb(r: DbRow): GalleryItem {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    category: r.category,
    src: r.src,
    embedUrl: r.embed_url ?? undefined,
    views: r.views ?? undefined,
    duration: r.duration ?? undefined,
    visible: r.visible,
    featured: r.featured,
    order: r.sort_order,
    createdAt: r.created_at,
    mediaType: r.media_type,
    rowKey: r.row_key,
  };
}

export interface GalleryInput {
  type: "photo" | "reel";
  title: string;
  category: string;
  src: string;
  embedUrl?: string;
  views?: string;
  duration?: string;
  mediaType?: GalleryMediaType;
  rowKey?: GalleryRowKey;
  featured?: boolean;
  visible?: boolean;
}

export interface GalleryPatch {
  title?: string;
  category?: string;
  src?: string;
  embedUrl?: string | null;
  views?: string | null;
  duration?: string | null;
  mediaType?: GalleryMediaType;
  rowKey?: GalleryRowKey;
  featured?: boolean;
  visible?: boolean;
  order?: number;
}

/* ---- reads -------------------------------------------------------------- */

export async function listGalleryItems(): Promise<GalleryItem[]> {
  if (supabaseEnabled) {
    const rows = await selectRows<DbRow>(TABLE, "select=*&order=row_key.asc,sort_order.asc");
    return rows.map(fromDb);
  }
  const items = await getGallery();
  return items.map((i) => ({
    ...i,
    mediaType: i.mediaType ?? "image",
    rowKey: i.rowKey ?? DEFAULT_ROW,
  }));
}

export async function listPublicGallery(): Promise<GalleryItem[]> {
  const items = await listGalleryItems();
  return items.filter((i) => i.visible).sort((a, b) => a.order - b.order);
}

/**
 * Seed fallback — keeps the portfolio populated if Supabase is unreachable
 * (network blip / cold start) instead of rendering an empty grid.
 */
export function seedGalleryRows(): Record<GalleryRowKey, GalleryItem[]> {
  return {
    hero: [],
    "wall-a": [],
    "wall-b": [],
    gallery: seedGallery.map((i) => ({ ...i, mediaType: "image" as const, rowKey: "gallery" as const })),
  };
}

/** Visible items grouped per home-page row, in display order. */
export async function getGalleryRows(): Promise<Record<GalleryRowKey, GalleryItem[]>> {
  const items = await listPublicGallery();
  const grouped: Record<GalleryRowKey, GalleryItem[]> = {
    hero: [],
    "wall-a": [],
    "wall-b": [],
    gallery: [],
  };
  for (const item of items) {
    const key = (item.rowKey ?? DEFAULT_ROW) as GalleryRowKey;
    (grouped[key] ?? grouped.gallery).push(item);
  }
  return grouped;
}

/** Never throws — falls back to the built-in seed gallery. */
export async function getGalleryRowsSafe(): Promise<Record<GalleryRowKey, GalleryItem[]>> {
  try {
    const rows = await getGalleryRows();
    if (rows.gallery.length === 0) rows.gallery = seedGalleryRows().gallery;
    return rows;
  } catch (e) {
    console.error("gallery unavailable, using seed fallback", e);
    return seedGalleryRows();
  }
}

/* ---- writes ------------------------------------------------------------- */

export async function createGalleryItem(input: GalleryInput): Promise<GalleryItem> {
  const rowKey = input.rowKey ?? DEFAULT_ROW;
  const base = {
    type: input.type,
    title: input.title,
    category: input.category,
    src: input.src,
    embed_url: input.embedUrl ?? null,
    views: input.views ?? null,
    duration: input.duration ?? null,
    media_type: input.mediaType ?? "image",
    row_key: rowKey,
    featured: input.featured ?? false,
    visible: input.visible ?? true,
  };

  // Next free slot inside the chosen row.
  const existing = await listGalleryItems();
  const order =
    existing.filter((i) => (i.rowKey ?? DEFAULT_ROW) === rowKey).reduce((m, i) => Math.max(m, i.order), 0) + 1;

  if (supabaseEnabled) {
    const [row] = await insertRow<DbRow>(TABLE, { ...base, sort_order: order });
    return fromDb(row);
  }

  const items = await getGallery();
  const item: GalleryItem = {
    id: randomUUID(),
    visible: base.visible,
    featured: base.featured,
    order,
    createdAt: new Date().toISOString(),
    type: base.type,
    title: base.title,
    category: base.category,
    src: base.src,
    embedUrl: base.embed_url ?? undefined,
    views: base.views ?? undefined,
    duration: base.duration ?? undefined,
    mediaType: base.media_type,
    rowKey: base.row_key,
  };
  items.push(item);
  await saveGallery(items);
  return item;
}

export async function updateGalleryItem(id: string, patch: GalleryPatch): Promise<GalleryItem | null> {
  const changes: Record<string, unknown> = {};
  if (patch.title !== undefined) changes.title = patch.title;
  if (patch.category !== undefined) changes.category = patch.category;
  if (patch.src !== undefined) changes.src = patch.src;
  if (patch.embedUrl !== undefined) changes.embed_url = patch.embedUrl || null;
  if (patch.views !== undefined) changes.views = patch.views || null;
  if (patch.duration !== undefined) changes.duration = patch.duration || null;
  if (patch.mediaType !== undefined) changes.media_type = patch.mediaType;
  if (patch.rowKey !== undefined) changes.row_key = patch.rowKey;
  if (patch.featured !== undefined) changes.featured = patch.featured;
  if (patch.visible !== undefined) changes.visible = patch.visible;
  if (patch.order !== undefined) changes.sort_order = patch.order;

  if (Object.keys(changes).length === 0) return null;

  // Moving an item to another row drops it at the end of that row so the
  // existing order inside the target row is never overwritten.
  if (patch.rowKey !== undefined && patch.order === undefined) {
    const siblings = (await listGalleryItems()).filter(
      (i) => (i.rowKey ?? DEFAULT_ROW) === patch.rowKey && i.id !== id
    );
    changes.sort_order = siblings.reduce((m, i) => Math.max(m, i.order), 0) + 1;
  }

  if (supabaseEnabled) {
    const [row] = await updateRows<DbRow>(TABLE, `id=eq.${encodeURIComponent(id)}`, changes);
    return row ? fromDb(row) : null;
  }

  const items = await getGallery();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const current = items[idx];
  items[idx] = {
    ...current,
    title: patch.title ?? current.title,
    category: patch.category ?? current.category,
    src: patch.src ?? current.src,
    embedUrl: patch.embedUrl === undefined ? current.embedUrl : patch.embedUrl || undefined,
    views: patch.views === undefined ? current.views : patch.views || undefined,
    duration: patch.duration === undefined ? current.duration : patch.duration || undefined,
    mediaType: patch.mediaType ?? current.mediaType,
    rowKey: patch.rowKey ?? current.rowKey,
    featured: patch.featured ?? current.featured,
    visible: patch.visible ?? current.visible,
    order: patch.order ?? current.order,
  };
  await saveGallery(items);
  return items[idx];
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  if (supabaseEnabled) {
    const [existing] = await selectRows<DbRow>(TABLE, `select=*&id=eq.${encodeURIComponent(id)}`);
    if (!existing) return false;
    await deleteRows(TABLE, `id=eq.${encodeURIComponent(id)}`);
    const path = objectPathFromUrl(existing.src);
    if (path) {
      // Best effort — a missing object must not fail the delete.
      await removeObjects([path]).catch(() => undefined);
    }
    return true;
  }

  const items = await getGallery();
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  await saveGallery(next);
  return true;
}

/** Swaps sort order with the neighbouring item inside the same row. */
export async function moveGalleryItem(id: string, direction: "up" | "down"): Promise<boolean> {
  const items = await listGalleryItems();
  const item = items.find((i) => i.id === id);
  if (!item) return false;

  const siblings = items
    .filter((i) => (i.rowKey ?? DEFAULT_ROW) === (item.rowKey ?? DEFAULT_ROW))
    .sort((a, b) => a.order - b.order);
  const index = siblings.findIndex((i) => i.id === id);
  const target = siblings[direction === "up" ? index - 1 : index + 1];
  if (!target) return false;

  await updateGalleryItem(item.id, { order: target.order });
  await updateGalleryItem(target.id, { order: item.order });
  return true;
}

/* ---- media uploads ------------------------------------------------------ */

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB (bucket limit)

export interface UploadResult {
  url: string;
  mediaType: GalleryMediaType;
  objectPath?: string;
}

export function extensionFor(mime: string): { ext: string; mediaType: GalleryMediaType } | null {
  if (IMAGE_TYPES[mime]) return { ext: IMAGE_TYPES[mime], mediaType: "image" };
  if (VIDEO_TYPES[mime]) return { ext: VIDEO_TYPES[mime], mediaType: "video" };
  return null;
}

/** Uploads to Supabase Storage (when configured). Throws a readable Error otherwise. */
export async function uploadGalleryMedia(file: File): Promise<UploadResult> {
  const kind = extensionFor(file.type);
  if (!kind) {
    throw new Error("Unsupported file type. Use JPG, PNG, WebP, GIF, MP4, WebM or MOV.");
  }
  const limit = kind.mediaType === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    throw new Error(
      kind.mediaType === "video"
        ? "Video is too large (max 50 MB). Compress it to 1080p MP4 and retry."
        : "Image is too large (max 15 MB)."
    );
  }
  if (!supabaseEnabled) {
    throw new Error(
      "Supabase storage is not configured on this server. Add SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (see DEPLOY.md)."
    );
  }

  const objectPath = `uploads/${Date.now()}-${randomUUID().slice(0, 8)}.${kind.ext}`;
  const url = await uploadObject(objectPath, file, file.type);
  return { url, mediaType: kind.mediaType, objectPath };
}
