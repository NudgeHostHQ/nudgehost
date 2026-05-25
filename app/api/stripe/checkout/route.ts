import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { stripe, planForPriceId } from "@/lib/stripe";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to upgrade." },
      { status: 401 },
    );
  }

  let body: { priceId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const priceId = typeof body.priceId === "string" ? body.priceId : "";

  // Only accept the two prices we sell, so a tampered request can't check out
  // against an arbitrary price.
  if (!priceId || !planForPriceId(priceId)) {
    return NextResponse.json(
      { error: "That plan is not available. Please pick a plan and try again." },
      { status: 400 },
    );
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  // Ensure the account row exists, then reuse any Stripe customer we've already
  // created for this user.
  const [existing] = await db
    .insert(users)
    .values({ id: userId, email })
    .onConflictDoUpdate({
      target: users.id,
      set: { email, updatedAt: new Date() },
    })
    .returning({ stripeCustomerId: users.stripeCustomerId });

  let customerId = existing?.stripeCustomerId ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: email || undefined,
      metadata: { userId },
    });
    customerId = customer.id;
    await db
      .update(users)
      .set({ stripeCustomerId: customerId, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/dashboard?payment=success`,
      cancel_url: `${SITE_URL}/pricing?payment=cancelled`,
      // Carried into the webhook so we can match the session back to the user.
      client_reference_id: userId,
      metadata: { userId },
      subscription_data: { metadata: { userId } },
    });
  } catch {
    return NextResponse.json(
      { error: "We could not start checkout. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
