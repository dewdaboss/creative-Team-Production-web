import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const store = await cookies();
  return NextResponse.json({ authenticated: verifySessionToken(store.get(COOKIE_NAME)?.value) });
}
