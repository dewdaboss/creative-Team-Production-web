import { NextResponse } from "next/server";
import { getVisitors, recordVisit } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/** Fire-and-forget visitor ping — one count per IP per 30 minutes. */
export async function POST(req: Request) {
  const ip = clientIp(req);
  const counted = rateLimit(`visit:${ip}`, 1, 30 * 60_000);
  if (counted) {
    const today = new Date().toISOString().slice(0, 10);
    return NextResponse.json(await recordVisit(today));
  }
  return NextResponse.json(await getVisitors());
}
