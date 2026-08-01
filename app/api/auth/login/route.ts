import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkCredentials, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 8, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try later." }, { status: 429 });
  }
  const { user, pass } = (await req.json().catch(() => ({}))) as { user?: string; pass?: string };
  if (!user || !pass || !checkCredentials(user, pass)) {
    return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
  }
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 3600,
  });
  return NextResponse.json({ ok: true });
}
