import { NextResponse } from "next/server";
import { sessionToken, verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const token = await sessionToken();
  return NextResponse.json({ authenticated: verifySessionToken(token) });
}
