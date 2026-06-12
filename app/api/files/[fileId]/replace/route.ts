import { NextResponse, after } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, files } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";
import { storeThumbnail } from "@/lib/thumbnail-store";
import {
  deleteSiteObjects,
  hasZipMagic,
  isZipUpload,
  planSiteUnpack,
  scanZipForSite,
  unpackZipToSite,
} from "@/lib/site-store";
import {
  convertAndStoreDocxHtml,
  deleteDerivedObjects,
  isDocxUpload,
} from "@/lib/docx-store";

export const runtime = "nodejs";
// Room to unpack a large replacement archive into per-file R2 objects.
export const maxDuration = 300;

// Per-plan upload ceilings, kept in step with app/api/upload/presign/route.ts.
const PLAN_MAX_FILE_BYTES: Record<string, number> = {
  free: 25 * 1024 * 1024, // 25MB
  pro: 250 * 1024 * 1024, // 250MB
  team: 1073741824, // 1GB
};

// Human-readable ceiling for error copy, e.g. "25MB" or "1GB".
function formatLimit(bytes: number): string {
  if (bytes >= 1073741824) return `${Math.round(bytes / 1073741824)}GB`;
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

// Strip anything that would make an awkward object key. The original filename
// is still stored on the row for display and download. Mirrors presign.
function safeKeyName(filename: string): string {
  const cleaned = filename
    .replace(/[/\\]/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 200);
  return cleaned.length > 0 ? cleaned : "file";
}

// Replace the file behind an existing link without changing the URL.
//
// Accepts a multipart form ("file" field) with the new file. The bytes land on
// the server, get pushed to R2 under a brand-new object key, and the row is
// repointed at them. The slug, view count, created_at, password, and expiry are
// all left untouched, so /f/[slug] keeps working and analytics carry over.
// Only the content, filename, content type, size, and updated_at change. The
// old object is removed from R2 once the new one is confirmed in place.
//
// ZIPs cross over in both directions. A ZIP with an index.html is validated
// first, then the old unpacked objects (if any) are cleared and the new
// archive is unpacked to the same sites/{fileId}/ prefix, so the URL stays
// stable; a brief gap during the swap is accepted rather than building an
// atomic swap. A ZIP without an index.html is stored as a plain downloadable
// file like any other replacement, and a non-site replacing a site clears
// the unpacked objects so the row goes back to plain-file serving.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to replace your files." },
      { status: 401 },
    );
  }

  const { fileId } = await params;
  if (!fileId) {
    return NextResponse.json(
      { error: "We could not tell which file to replace." },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "We could not read that upload. Please try again." },
      { status: 400 },
    );
  }

  const upload = formData.get("file");
  if (!(upload instanceof File)) {
    return NextResponse.json(
      { error: "Please choose a file to upload." },
      { status: 400 },
    );
  }

  if (upload.size <= 0) {
    return NextResponse.json(
      { error: "That file looks empty. Please pick another file." },
      { status: 400 },
    );
  }

  // Confirm ownership before touching anything. A soft-deleted file can't be
  // resurrected this way.
  const [file] = await db
    .select()
    .from(files)
    .where(and(eq(files.id, fileId), eq(files.userId, userId)))
    .limit(1);

  if (!file || file.isDeleted) {
    return NextResponse.json(
      { error: "We could not find that file." },
      { status: 404 },
    );
  }

  // The replacement is held to the same ceiling as a fresh upload on this plan.
  const [account] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const plan = account?.plan ?? "free";
  const maxBytes = PLAN_MAX_FILE_BYTES[plan] ?? PLAN_MAX_FILE_BYTES.free;

  if (upload.size > maxBytes) {
    return NextResponse.json(
      {
        error: `That file is over the ${formatLimit(maxBytes)} limit on your plan. Try a smaller file or upgrade for more room.`,
      },
      { status: 413 },
    );
  }

  const contentType = upload.type || "application/octet-stream";
  const oldKey = file.fileKey;
  const wasSite = file.kind === "site";
  const wasDocx = file.kind === "docx";

  let buffer: Buffer;
  try {
    buffer = Buffer.from(await upload.arrayBuffer());
  } catch {
    return NextResponse.json(
      { error: "We could not read that file. Please try again." },
      { status: 400 },
    );
  }

  // DOCX wins over ZIP (a .docx is itself a ZIP container and must never
  // reach the site unpacker); it follows the plain-file path below plus a
  // regenerated derived HTML object.
  const newIsDocx = isDocxUpload(upload.name) && hasZipMagic(buffer);

  // Site detection is a fallback decision, not a gate: a ZIP with an
  // index.html replaces as a served site, any other ZIP replaces as a plain
  // downloadable file, and only genuine safety problems reject the request.
  // An unreadable archive degrades to a plain download too.
  let newIsSiteZip = false;
  if (!newIsDocx && isZipUpload(upload.name, contentType) && hasZipMagic(buffer)) {
    const scan = await scanZipForSite(buffer);
    if (scan.kind === "unsafe") {
      // Nothing has been torn down yet, so whatever is currently live stays.
      return NextResponse.json({ error: scan.error }, { status: 422 });
    }
    newIsSiteZip = scan.kind === "scanned" && scan.hasIndex;
  }

  let updated: typeof file;

  if (newIsSiteZip) {
    // Validate the archive before tearing anything down, so a bad ZIP leaves
    // whatever is currently live untouched.
    const planCheck = await planSiteUnpack(buffer, maxBytes);
    if (!planCheck.ok) {
      return NextResponse.json({ error: planCheck.error }, { status: 422 });
    }

    if (wasSite) {
      // Clear the old unpacked objects first so files dropped from the new
      // build don't linger under the prefix. The link serves a brief gap
      // while the new objects land; an atomic swap is deliberately not built.
      try {
        await deleteSiteObjects(file.id);
      } catch {
        return NextResponse.json(
          { error: "We could not clear out the old site. Please try again." },
          { status: 502 },
        );
      }
    }

    const result = await unpackZipToSite({
      fileId: file.id,
      zipBuffer: buffer,
      maxTotalBytes: maxBytes,
    });
    if (!result.ok) {
      // Partial output under the prefix would shadow a retry; clear it.
      try {
        await deleteSiteObjects(file.id);
      } catch {
        // Orphaned partial objects; the next successful unpack or the
        // purge paths overwrite or remove them.
      }
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    // The archive itself is never stored on a replacement (the unpacked
    // objects are the only copy anything serves, matching the confirm flow,
    // which deletes the archive after unpacking). fileKey keeps its old value
    // as a dangling pointer; site rows never read it and deletes against it
    // are no-ops.
    [updated] = await db
      .update(files)
      .set({
        kind: "site",
        entryPath: result.entryPath,
        filename: upload.name,
        mimeType: contentType,
        fileSize: upload.size,
        updatedAt: new Date(),
      })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();

    // If the row used to be a plain file, its single object is now stale.
    if (!wasSite && oldKey) {
      try {
        await r2.send(
          new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: oldKey }),
        );
      } catch {
        // Orphaned old object; the swap already succeeded for the user.
      }
    }

    // A docx replaced by a site leaves its derived HTML behind; clear it.
    if (wasDocx) {
      try {
        await deleteDerivedObjects(file.id);
      } catch {
        // Orphaned derived object; unreachable since the row is kind "site".
      }
    }
  } else {
    const newKey = `${userId}/${nanoid(12)}/${safeKeyName(upload.name)}`;

    // Push the new bytes to R2 under a fresh key, then confirm they landed
    // before we repoint the row. Writing to a new key means a failure here
    // never harms the file that's currently live.
    try {
      await r2.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: newKey,
          Body: buffer,
          ContentType: contentType,
          ContentLength: upload.size,
        }),
      );
      await r2.send(
        new HeadObjectCommand({ Bucket: R2_BUCKET, Key: newKey }),
      );
    } catch {
      return NextResponse.json(
        { error: "That upload did not finish. Please try again." },
        { status: 502 },
      );
    }

    // A DOCX replacement regenerates the derived HTML now that the original
    // bytes are safely in place. The store overwrites the same
    // derived/{fileId}/document.html key, so a docx-to-docx swap needs no
    // separate delete. A failed conversion keeps the upload as a plain file.
    let docxStored = false;
    if (newIsDocx) {
      docxStored = await convertAndStoreDocxHtml({
        fileId: file.id,
        buffer,
      });
    }

    // Repoint the row. slug, viewCount, createdAt, passwordHash, and expiresAt
    // are deliberately left out of the update so they survive the swap. A row
    // that was a site goes back to plain-file serving.
    [updated] = await db
      .update(files)
      .set({
        kind: docxStored ? "docx" : "file",
        entryPath: null,
        fileKey: newKey,
        filename: upload.name,
        mimeType: contentType,
        fileSize: upload.size,
        updatedAt: new Date(),
      })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();

    // New file is live and the row points at it. Clean up the old object. A
    // failure here only leaves an orphan blob, so it must not fail the request.
    if (oldKey && oldKey !== newKey) {
      try {
        await r2.send(
          new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: oldKey }),
        );
      } catch {
        // Orphaned old object; the swap already succeeded for the user.
      }
    }

    // A site replaced by a plain file leaves its unpacked objects behind;
    // clear them now that the row no longer serves from the prefix.
    if (wasSite) {
      try {
        await deleteSiteObjects(file.id);
      } catch {
        // Orphaned site objects; unreachable since the row is kind "file".
      }
    }

    // A docx replaced by anything that did not store fresh derived HTML
    // (a non-docx, or a docx whose conversion failed) leaves the old derived
    // object stale; clear it so nothing can ever serve it again.
    if (wasDocx && !docxStored) {
      try {
        await deleteDerivedObjects(file.id);
      } catch {
        // Orphaned derived object; unreachable since the row is kind "file".
      }
    }
  }

  // Regenerate the og:image thumbnail from the new bytes after the response
  // flushes. It overwrites the same thumbnails/{fileId}.png object, so the
  // preview URL stays the same and cached unfurls refresh in their own time.
  after(async () => {
    await storeThumbnail({
      fileId: file.id,
      mimeType: contentType,
      filename: upload.name,
      buffer,
    });
  });

  return NextResponse.json({
    file: {
      id: updated.id,
      filename: updated.filename,
      slug: updated.slug,
      fileSize: updated.fileSize,
      mimeType: updated.mimeType,
      viewCount: updated.viewCount,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      hasPassword: Boolean(updated.passwordHash),
      expiresAt: updated.expiresAt,
    },
  });
}
