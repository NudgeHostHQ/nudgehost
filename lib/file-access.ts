import { createHash, createHmac, timingSafeEqual } from "crypto";
import { SITES_DOMAIN } from "@/lib/sites-domain";

// Cookie name that marks a password-protected file as unlocked for a visitor.
// Set in two places with the same name and value but different scopes: by the
// verify-password route on the main domain (for the viewer and legacy paths)
// and by the subdomain serving path when it redeems a handoff token (scoped
// to that one site's origin).
export function unlockCookieName(fileId: string): string {
  return `nh_unlock_${fileId}`;
}

// A deterministic unlock token tied to the file and its CURRENT password hash.
// The bcrypt hash never reaches the browser, so the token can't be forged, and
// rotating the password changes the hash, which invalidates old cookies.
export function unlockToken(fileId: string, passwordHash: string): string {
  return createHash("sha256").update(`${fileId}:${passwordHash}`).digest("hex");
}

// Query param that carries the one-time unlock handoff token from the main
// domain to a site's subdomain.
export const UNLOCK_HANDOFF_PARAM = "nh_unlock";

// Long enough for one redirect hop, short enough that a leaked URL (browser
// history, a pasted link) is dead by the time anyone reuses it.
const HANDOFF_TTL_SECONDS = 60;

// HMAC keyed on R2_SECRET_ACCESS_KEY, the server secret every serving
// deployment already has (nothing serves without it), with the current
// password hash mixed in so a password change invalidates handoff tokens
// still in flight.
function handoffSignature(
  fileId: string,
  passwordHash: string,
  expiry: number,
): string {
  return createHmac(
    "sha256",
    `${process.env.R2_SECRET_ACCESS_KEY ?? ""}:${passwordHash}`,
  )
    .update(`${fileId}:${expiry}`)
    .digest("hex");
}

// A short-lived, single-purpose token minted after a correct password entry
// on the main domain. Redeeming it on the site's subdomain does exactly one
// thing: set the per-site unlock cookie there. It grants nothing else.
export function createUnlockHandoffToken(
  fileId: string,
  passwordHash: string,
): string {
  const expiry = Math.floor(Date.now() / 1000) + HANDOFF_TTL_SECONDS;
  return `${expiry}.${handoffSignature(fileId, passwordHash, expiry)}`;
}

// Constant-time check of a presented handoff token. Expired, malformed, and
// tampered tokens all fail the same way; callers fall through to the normal
// locked behavior.
export function verifyUnlockHandoffToken(
  token: string,
  fileId: string,
  passwordHash: string,
): boolean {
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const expiry = Number(token.slice(0, dot));
  if (!Number.isSafeInteger(expiry) || expiry * 1000 < Date.now()) {
    return false;
  }
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(handoffSignature(fileId, passwordHash, expiry));
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// Where a just-unlocked visitor is sent: the site's subdomain root, carrying
// a fresh handoff token for the serving path to redeem.
export function unlockHandoffUrl(
  slug: string,
  fileId: string,
  passwordHash: string,
): string {
  const token = createUnlockHandoffToken(fileId, passwordHash);
  return `https://${slug}.${SITES_DOMAIN}/?${UNLOCK_HANDOFF_PARAM}=${token}`;
}
