import { NextResponse } from "next/server";
import { getStats, getVisitors } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [stats, visitors] = await Promise.all([getStats(), getVisitors()]);
  return NextResponse.json({ ...stats, visitors: visitors.total, visitorsToday: visitors.today });
}
