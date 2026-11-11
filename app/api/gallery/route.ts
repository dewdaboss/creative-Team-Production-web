import { NextResponse } from "next/server";
import { listPublicGallery, seedGalleryRows } from "@/lib/gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public gallery feed — visible items only.
 * Optional `?row=hero|wall-a|wall-b|gallery` narrows it to one home-page row.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const row = searchParams.get("row");

  try {
    const items = await listPublicGallery();
    const filtered = row ? items.filter((i) => (i.rowKey ?? "gallery") === row) : items;
    return NextResponse.json({ items: filtered });
  } catch (e) {
    // Never fail the public gallery — fall back to the built-in portfolio.
    console.error("public gallery failed, using seed fallback", e);
    const fallback = seedGalleryRows().gallery.filter((i) => i.visible);
    return NextResponse.json({ items: fallback, fallback: true });
  }
}
