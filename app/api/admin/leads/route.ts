import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getLeads } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ leads: await getLeads() });
}
