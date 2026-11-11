import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  createGalleryItem,
  deleteGalleryItem,
  galleryReadSource,
  listGalleryItems,
  moveGalleryItem,
  updateGalleryItem,
  usingSupabase,
} from "@/lib/gallery";
import { ROW_KEYS } from "@/lib/gallery-rows";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rowKeySchema = z.enum(["hero", "wall-a", "wall-b", "gallery"]);

const itemSchema = z.object({
  type: z.enum(["photo", "reel"]),
  title: z.string().min(1).max(120),
  category: z.string().min(1).max(60),
  src: z.string().min(1),
  embedUrl: z.string().optional(),
  views: z.string().max(12).optional(),
  duration: z.string().max(8).optional(),
  mediaType: z.enum(["image", "video"]).optional(),
  rowKey: rowKeySchema.optional(),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
});

const patchSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(120).optional(),
  category: z.string().min(1).max(60).optional(),
  src: z.string().min(1).optional(),
  visible: z.boolean().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
  embedUrl: z.string().optional(),
  views: z.string().max(12).optional(),
  duration: z.string().max(8).optional(),
  mediaType: z.enum(["image", "video"]).optional(),
  rowKey: rowKeySchema.optional(),
  move: z.enum(["up", "down"]).optional(),
});

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const items = await listGalleryItems();
  const order = Object.fromEntries(ROW_KEYS.map((k, i) => [k, i]));
  const sorted = items.sort(
    (a, b) =>
      (order[a.rowKey ?? "gallery"] ?? 9) - (order[b.rowKey ?? "gallery"] ?? 9) || a.order - b.order
  );
  return NextResponse.json({
    items: sorted,
    rows: ROW_KEYS,
    backend: usingSupabase ? galleryReadSource() : "json",
  });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const parsed = itemSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid gallery item." }, { status: 400 });
  }
  try {
    const item = await createGalleryItem(parsed.data);
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    console.error("gallery create failed", e);
    return NextResponse.json({ ok: false, error: "Could not save the gallery item." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid update." }, { status: 400 });
  }
  const { id, move, ...changes } = parsed.data;
  try {
    if (move) {
      const ok = await moveGalleryItem(id, move);
      if (!ok) return NextResponse.json({ ok: false, error: "Already at the edge of this row." }, { status: 400 });
      return NextResponse.json({ ok: true });
    }
    const item = await updateGalleryItem(id, changes);
    if (!item) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    console.error("gallery update failed", e);
    return NextResponse.json({ ok: false, error: "Could not update the gallery item." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });
  try {
    const ok = await deleteGalleryItem(id);
    if (!ok) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("gallery delete failed", e);
    return NextResponse.json({ ok: false, error: "Could not delete the gallery item." }, { status: 500 });
  }
}
