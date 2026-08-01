import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getGallery, saveGallery } from "@/lib/store";
import type { GalleryItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const itemSchema = z.object({
  type: z.enum(["photo", "reel"]),
  title: z.string().min(1).max(120),
  category: z.string().min(1).max(60),
  src: z.string().min(1),
  embedUrl: z.string().optional(),
  views: z.string().max(12).optional(),
  duration: z.string().max(8).optional(),
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
  const items = (await getGallery()).sort((a, b) => a.order - b.order);
  return NextResponse.json({ items });
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
  const items = await getGallery();
  const order = items.reduce((m, i) => Math.max(m, i.order), 0) + 1;
  const item: GalleryItem = {
    id: randomUUID(),
    visible: true,
    order,
    createdAt: new Date().toISOString(),
    ...parsed.data,
  };
  items.push(item);
  await saveGallery(items);
  return NextResponse.json({ ok: true, item });
}

const patchSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(120).optional(),
  category: z.string().min(1).max(60).optional(),
  visible: z.boolean().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
  embedUrl: z.string().optional(),
});

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
  const { id, ...changes } = parsed.data;
  const items = await getGallery();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  items[idx] = { ...items[idx], ...changes };
  await saveGallery(items);
  return NextResponse.json({ ok: true, item: items[idx] });
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
  const items = await getGallery();
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  await saveGallery(next);
  return NextResponse.json({ ok: true });
}
