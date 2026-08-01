import { NextResponse } from "next/server";
import { getVisitors, saveVisitors } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/** Fire-and-forget visitor ping — one count per IP per 30 minutes. */
export async function POST(req: Request) {
  const ip = clientIp(req);
  const counted = rateLimit(`visit:${ip}`, 1, 30 * 60_000);
  if (counted) {
    const v = await getVisitors();
    const today = new Date().toISOString().slice(0, 10);
    const next = {
      total: v.total + 1,
      today: v.day === today ? v.today + 1 : 1,
      day: today,
    };
    await saveVisitors(next);
    return NextResponse.json(next);
  }
  return NextResponse.json(await getVisitors());
}
