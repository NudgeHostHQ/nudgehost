import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";

export const runtime = "nodejs";

type Updates = {
  updatedAt: Date;
  passwordHash?: string | null;
  expiresAt?: Date | null;
};

// Update password protection and/or expiry on a file the caller owns.
// Body: { password?: string | null, expiresAt?: string | null }
//   password: omit = no change, null = clear, non-empty string = set.
//   expiresAt: omit = no change, null = clear, ISO/date string = set.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to update your files." },
      { status: 401 },
    );
  }

  const { fileId } = await params;
  if (!fileId) {
    return NextResponse.json(
      { error: "We could not tell which file to update." },
      { status: 400 },
    );
  }

  let body: { password?: unknown; expiresAt?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  // Confirm ownership before touching anything.
  const [file] = await db
    .select({ id: files.id })
    .from(files)
    .where(and(eq(files.id, fileId), eq(files.userId, userId)))
    .limit(1);

  if (!file) {
    return NextResponse.json(
      { error: "We could not find that file." },
      { status: 404 },
    );
  }

  const updates: Updates = { updatedAt: new Date() };

  if ("password" in body) {
    const password = body.password;
    if (password === null) {
      updates.passwordHash = null;
    } else if (typeof password === "string" && password.length > 0) {
      updates.passwordHash = await bcrypt.hash(password, 10);
    } else {
      return NextResponse.json(
        { error: "Please enter a password, or turn protection off." },
        { status: 400 },
      );
    }
  }

  if ("expiresAt" in body) {
    const expiresAt = body.expiresAt;
    if (expiresAt === null) {
      updates.expiresAt = null;
    } else if (typeof expiresAt === "string") {
      const date = new Date(expiresAt);
      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "That expiry date doesn't look right." },
          { status: 400 },
        );
      }
      updates.expiresAt = date;
    } else {
      return NextResponse.json(
        { error: "That expiry date doesn't look right." },
        { status: 400 },
      );
    }
  }

  const [updated] = await db
    .update(files)
    .set(updates)
    .where(and(eq(files.id, fileId), eq(files.userId, userId)))
    .returning();

  // Never return the password hash to the client.
  return NextResponse.json({
    file: {
      id: updated.id,
      filename: updated.filename,
      slug: updated.slug,
      hasPassword: Boolean(updated.passwordHash),
      expiresAt: updated.expiresAt,
      viewCount: updated.viewCount,
    },
  });
}
