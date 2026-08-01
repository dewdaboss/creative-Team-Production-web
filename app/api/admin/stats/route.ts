import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getStats, getVisitors, saveStats } from "@/lib/store";

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
  const [stats, visitors] = await Promise.all([getStats(), getVisitors()]);
  return NextResponse.json({ stats: { ...stats, visitors: visitors.total, visitorsToday: visitors.today } });
}

const schema = z.object({
  instagramFollowers: z.number().int().min(0).optional(),
  followersToday: z.number().int().min(0).optional(),
  projectsDelivered: z.number().int().min(0).optional(),
  happyClients: z.number().int().min(0).optional(),
  reelsProduced: z.number().int().min(0).optional(),
});

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid stats." }, { status: 400 });
  const stats = { ...(await getStats()), ...parsed.data, updatedAt: new Date().toISOString() };
  await saveStats(stats);
  return NextResponse.json({ ok: true, stats });
}
