import { NextResponse } from "next/server";
import { getReviews } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const reviews = (await getReviews()).filter((r) => r.visible);
  const avg =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0;
  return NextResponse.json({ reviews, average: avg, count: reviews.length });
}
