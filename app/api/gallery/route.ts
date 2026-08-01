import { NextResponse } from "next/server";
import { getGallery } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getGallery();
  const visible = items
    .filter((i) => i.visible)
    .sort((a, b) => a.order - b.order);
  return NextResponse.json({ items: visible });
}
