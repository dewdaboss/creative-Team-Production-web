import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getReviews, saveReviews } from "@/lib/store";
import type { Review } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  return NextResponse.json({ reviews: await getReviews() });
}

const createSchema = z.object({
  name: z.string().min(1).max(80),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1).max(600),
  service: z.string().max(60).optional(),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid review." }, { status: 400 });
  }
  const reviews = await getReviews();
  const review: Review = {
    id: randomUUID(),
    date: new Date().toISOString(),
    visible: true,
    ...parsed.data,
  };
  reviews.unshift(review);
  await saveReviews(reviews);
  return NextResponse.json({ ok: true, review });
}

const patchSchema = z.object({
  id: z.string(),
  visible: z.boolean().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid update." }, { status: 400 });
  const reviews = await getReviews();
  const idx = reviews.findIndex((r) => r.id === parsed.data.id);
  if (idx === -1) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  const { id, ...changes } = parsed.data;
  reviews[idx] = { ...reviews[idx], ...changes };
  await saveReviews(reviews);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });
  await saveReviews((await getReviews()).filter((r) => r.id !== id));
  return NextResponse.json({ ok: true });
}
