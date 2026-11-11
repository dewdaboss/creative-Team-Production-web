import { NextResponse } from "next/server";
import { checkCredentials, createSessionToken, COOKIE_NAME, sessionCookieOptions } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 8, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try later." }, { status: 429 });
  }
  const { user, pass } = (await req.json().catch(() => ({}))) as { user?: string; pass?: string };
  if (!user || !pass || !checkCredentials(user, pass)) {
    return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
  }

  const token = createSessionToken(user);
  const res = NextResponse.json({ ok: true, token });
  // HttpOnly cookie (normal browsing) + token in the body (used as a Bearer
  // header when the dashboard runs inside a cross-site iframe).
  res.cookies.set(COOKIE_NAME, token, sessionCookieOptions(req));
  return res;
}
