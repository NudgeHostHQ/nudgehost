import { createHash } from "crypto";

// Cookie name that marks a password-protected file as unlocked for a visitor.
export function unlockCookieName(fileId: string): string {
  return `nh_unlock_${fileId}`;
}

// A deterministic unlock token tied to the file and its CURRENT password hash.
// The bcrypt hash never reaches the browser, so the token can't be forged, and
// rotating the password changes the hash, which invalidates old cookies.
export function unlockToken(fileId: string, passwordHash: string): string {
  return createHash("sha256").update(`${fileId}:${passwordHash}`).digest("hex");
}
