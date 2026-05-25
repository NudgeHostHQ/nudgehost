import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to manage billing." },
      { status: 401 },
    );
  }

  const [user] = await db
    .select({ stripeCustomerId: users.stripeCustomerId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "We could not find a billing account for you yet." },
      { status: 404 },
    );
  }

  let session;
  try {
    session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${SITE_URL}/dashboard`,
    });
  } catch {
    return NextResponse.json(
      { error: "We could not open the billing portal. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
