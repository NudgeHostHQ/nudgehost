import { randomBytes } from "crypto";

// Anonymous-visitor identity for signed-out uploads. A random 128-bit token
// lives in an httpOnly cookie for a year and is stamped on each file row as
// anonToken; the confirm route and the active-file cap both match on it.

export const ANON_COOKIE_NAME = "nh_anon";
export const ANON_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// Anonymous limits. Size matches the free plan; the active-file cap counts
// non-deleted, non-expired rows carrying the visitor's token.
export const ANON_MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB
export const ANON_MAX_ACTIVE_FILES = 3;
export const ANON_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// 128 bits, hex-encoded: 32 lowercase hex chars.
export function generateAnonToken(): string {
  return randomBytes(16).toString("hex");
}

// Only ever accept a cookie value that looks exactly like one of our tokens,
// so a tampered cookie can't be used to probe arbitrary anonToken values
// beyond the same keyspace a fresh token comes from.
export function isValidAnonToken(value: string): boolean {
  return /^[a-f0-9]{32}$/.test(value);
}

// Best client IP we can see behind the proxy. Used only for rate limiting
// (hashed) and the Turnstile remoteip hint.
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
