import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { stripe, planForPriceId } from "@/lib/stripe";

// Stripe signature verification needs the exact raw request body, so this must
// run on the Node runtime and read the body manually (no parsing).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIVE_STATUSES = ["active", "trialing", "past_due"];

// The single source of truth for a subscription's plan: its first line item's
// price, gated by whether the subscription is still in good standing.
function planFromSubscription(sub: Stripe.Subscription): "free" | "pro" | "team" {
  const priceId = sub.items.data[0]?.price?.id;
  const plan = planForPriceId(priceId);
  if (!plan) return "free";
  return ACTIVE_STATUSES.includes(sub.status) ? plan : "free";
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // Raw body, untouched, for signature verification.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json(
      { error: "Signature verification failed." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId ?? session.client_reference_id;
        const customerId =
          typeof session.customer === "string" ? session.customer : null;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;

        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const plan = planFromSubscription(sub);

          // Prefer the userId we stamped on the session; fall back to the
          // customer we stored when checkout began.
          if (userId) {
            await db
              .update(users)
              .set({
                plan,
                stripeCustomerId: customerId ?? undefined,
                stripeSubscriptionId: subscriptionId,
                updatedAt: new Date(),
              })
              .where(eq(users.id, userId));
          } else if (customerId) {
            await db
              .update(users)
              .set({
                plan,
                stripeSubscriptionId: subscriptionId,
                updatedAt: new Date(),
              })
              .where(eq(users.stripeCustomerId, customerId));
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : null;
        if (customerId) {
          await db
            .update(users)
            .set({
              plan: planFromSubscription(sub),
              stripeSubscriptionId: sub.id,
              updatedAt: new Date(),
            })
            .where(eq(users.stripeCustomerId, customerId));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : null;
        if (customerId) {
          await db
            .update(users)
            .set({
              plan: "free",
              stripeSubscriptionId: null,
              updatedAt: new Date(),
            })
            .where(eq(users.stripeCustomerId, customerId));
        }
        break;
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch {
    // Returning 500 tells Stripe to retry, which is what we want if our own
    // database write failed transiently.
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
