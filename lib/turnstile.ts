// Server-side Cloudflare Turnstile verification for anonymous uploads.
// Fail closed: any missing secret, network failure, non-200, or unparseable
// body counts as "not verified" and the upload is rejected.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Anonymous uploads are only offered when the server can actually verify
// them. With no secret configured, the presign route falls back to requiring
// a signed-in session, matching the widget's no-site-key fallback.
export function turnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: remoteIp }),
    });
    if (!res.ok) return false;
    const data: { success?: unknown } = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}
