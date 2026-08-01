import crypto from "crypto";
import { cookies } from "next/headers";
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

/** Throws 401-shaped marker if the admin session is missing/invalid. */
export async function requireAdmin(): Promise<void> {
  const store = await cookies();
  if (!verifySessionToken(store.get(COOKIE_NAME)?.value)) {
    throw new AdminAuthError();
  }
}

export class AdminAuthError extends Error {
  constructor() {
    super("UNAUTHORIZED");
  }
}

export { COOKIE_NAME };
