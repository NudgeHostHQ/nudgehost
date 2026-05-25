import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { unlockCookieName, unlockToken } from "@/lib/file-access";

export const runtime = "nodejs";

// Public endpoint. Anyone with the link can submit the password; a correct
// guess sets an httpOnly unlock cookie so the viewer stays open on refresh.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;
  if (!fileId) {
    return NextResponse.json(
      { error: "We could not tell which file to unlock." },
      { status: 400 },
    );
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json(
      { error: "Please enter the password." },
      { status: 400 },
    );
  }

  const [file] = await db
    .select({
      id: files.id,
      passwordHash: files.passwordHash,
      isDeleted: files.isDeleted,
    })
    .from(files)
    .where(eq(files.id, fileId))
    .limit(1);

  if (!file || file.isDeleted) {
    return NextResponse.json(
      { error: "We could not find that file." },
      { status: 404 },
    );
  }

  if (!file.passwordHash) {
    // Nothing to unlock; treat as success so the viewer just shows it.
    return NextResponse.json({ success: true });
  }

  const ok = await bcrypt.compare(password, file.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "That password is not right. Please try again." },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(unlockCookieName(file.id), unlockToken(file.id, file.passwordHash), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });

  return NextResponse.json({ success: true });
}
