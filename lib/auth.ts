import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { serverEnv } from "./env";

const COOKIE_NAME = "ctp_admin";
const SESSION_HOURS = 12;

function b64url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function sign(data: string): string {
  return crypto.createHmac("sha256", serverEnv.sessionSecret).update(data).digest("base64url");
}

export function createSessionToken(user: string): string {
  const payload = b64url(JSON.stringify({ u: user, exp: Date.now() + SESSION_HOURS * 3600_000 }));
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function checkCredentials(user: string, pass: string): boolean {
  const a = Buffer.from(`${user}:${pass}`);
  const b = Buffer.from(`${serverEnv.adminUser}:${serverEnv.adminPass}`);
  return a.length === b.length ? crypto.timingSafeEqual(a, b) : false;
}

function bearerToken(raw: string | null): string | null {
  if (!raw) return null;
  const match = /^Bearer\s+(.+)$/i.exec(raw.trim());
  return match ? match[1] : null;
}

/**
 * Session token from either the HttpOnly cookie (normal browsing) or the
 * `Authorization: Bearer …` header (used by the dashboard when the site is
 * embedded in an iframe, where browsers block the cookie).
 */
export async function sessionToken(): Promise<string | null> {
  const h = await headers();
  const bearer = bearerToken(h.get("authorization"));
  if (bearer) return bearer;
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function isAdmin(): Promise<boolean> {
  return verifySessionToken(await sessionToken());
}

/**
 * Cookie attributes that survive being embedded on another origin
 * (Arena/editor previews, partner dashboards):
 *  - HTTPS  → SameSite=None + Secure + Partitioned (CHIPS)
 *  - HTTP   → SameSite=Lax (plain localhost dev)
 */
export function sessionCookieOptions(req: Request, maxAge = SESSION_HOURS * 3600) {
  const proto =
    req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    new URL(req.url).protocol.replace(":", "");
  const secure = proto === "https";
  return {
    httpOnly: true,
    sameSite: (secure ? "none" : "lax") as "none" | "lax",
    secure,
    partitioned: secure,
    path: "/",
    maxAge,
  };
}

/** Throws 401-shaped marker if the admin session is missing/invalid. */
export async function requireAdmin(): Promise<void> {
  if (!verifySessionToken(await sessionToken())) {
    throw new AdminAuthError();
  }
}

export class AdminAuthError extends Error {
  constructor() {
    super("UNAUTHORIZED");
  }
}

export { COOKIE_NAME };
