import Stripe from "stripe";

// Server-side Stripe client. STRIPE_SECRET_KEY is set in Vercel; a local
// placeholder in .env.local keeps the build working without live keys.
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

// apiVersion is intentionally omitted so the SDK uses its own pinned version,
// which keeps the bundled TypeScript types in sync.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Maps a Stripe price ID to the plan it grants. Returns null for any price we
// don't recognize, so an unexpected price can never silently upgrade a user.
export function planForPriceId(priceId: string | null | undefined): "pro" | "team" | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_TEAM_PRICE_ID) return "team";
  return null;
}
