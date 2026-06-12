import { NextResponse, after } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import {
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, files } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";
import { fetchAndStoreThumbnail } from "@/lib/thumbnail-store";
import {
  ANON_COOKIE_NAME,
  ANON_MAX_FILE_BYTES,
  isValidAnonToken,
} from "@/lib/anon-upload";
import {
  deleteSiteObjects,
  hasZipMagic,
  isZipUpload,
  scanZipForSite,
  unpackZipToSite,
} from "@/lib/site-store";
import { convertAndStoreDocxHtml, isDocxUpload } from "@/lib/docx-store";
import { isServableSiteLabel, siteUrlForSlug } from "@/lib/sites-domain";

export const runtime = "nodejs";
// Room to download and unpack a large archive into per-file R2 objects.
export const maxDuration = 300;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

// Per-plan upload ceilings, kept in step with app/api/upload/presign/route.ts.
// For ZIPs this caps the total UNCOMPRESSED size of the unpacked site, so an
// archive can't smuggle in more bytes than a plain upload could.
const PLAN_MAX_FILE_BYTES: Record<string, number> = {
  free: 25 * 1024 * 1024, // 25MB
  pro: 250 * 1024 * 1024, // 250MB
  team: 1073741824, // 1GB
};

export async function POST(request: Request) {
  const { userId } = await auth();

  // Anonymous confirms identify the visitor by the anon cookie set during
  // presign; the row lookup below is scoped to that token, mirroring how
  // signed-in confirms are scoped to the user.
  let anonToken: string | null = null;
  if (!userId) {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(ANON_COOKIE_NAME)?.value ?? "";
    if (!isValidAnonToken(cookieToken)) {
      return NextResponse.json(
        { error: "Please sign in to finish your upload." },
        { status: 401 },
      );
    }
    anonToken = cookieToken;
  }

  let body: { fileId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const fileId = typeof body.fileId === "string" ? body.fileId : "";
  if (!fileId) {
    return NextResponse.json(
      { error: "We lost track of that upload. Please start again." },
      { status: 400 },
    );
  }

  // Only ever touch a row that belongs to the caller: the signed-in user, or
  // the anonymous visitor whose token stamped the row.
  const ownerMatch = userId
    ? eq(files.userId, userId)
    : eq(files.anonToken, anonToken!);
  const [file] = await db
    .select()
    .from(files)
    .where(and(eq(files.id, fileId), ownerMatch))
    .limit(1);

  if (!file) {
    return NextResponse.json(
      { error: "We could not find that upload. Please start again." },
      { status: 404 },
    );
  }

  // Confirm the bytes actually landed in R2 before we hand out a link.
  try {
    await r2.send(
      new HeadObjectCommand({ Bucket: R2_BUCKET, Key: file.fileKey }),
    );
  } catch {
    // The object never arrived, so clear the orphaned row.
    await db.delete(files).where(eq(files.id, file.id));
    return NextResponse.json(
      {
        error:
          "That upload did not finish. Please try sending the file again.",
      },
      { status: 422 },
    );
  }

  // The link handed back below: /f/{slug} for plain files, the subdomain for
  // sites (set in the ZIP branch). Slugs that can't serve as a subdomain
  // label keep the legacy link, mirroring the viewer's redirect rules.
  let shareUrl = `${SITE_URL}/f/${file.slug}`;

  // DOCX uploads get a one-time mammoth render: the HTML is sanitized and
  // stored under derived/{fileId}/ and the viewer serves it sandboxed, while
  // the original .docx stays at fileKey as the download. Checked before the
  // ZIP branch because DOCX is itself a ZIP container; a .docx must never
  // reach the site unpacker (which fails closed and would reject the upload).
  // Conversion failure of any sort leaves the row a plain downloadable file.
  if (isDocxUpload(file.filename)) {
    let docxBuffer: Buffer | null = null;
    try {
      const object = await r2.send(
        new GetObjectCommand({ Bucket: R2_BUCKET, Key: file.fileKey }),
      );
      if (object.Body) {
        docxBuffer = Buffer.from(await object.Body.transformToByteArray());
      }
    } catch {
      docxBuffer = null;
    }

    if (docxBuffer && hasZipMagic(docxBuffer)) {
      const stored = await convertAndStoreDocxHtml({
        fileId: file.id,
        buffer: docxBuffer,
      });
      if (stored) {
        await db
          .update(files)
          .set({ kind: "docx", updatedAt: new Date() })
          .where(eq(files.id, file.id));
      }
    }
  }
  // ZIP uploads with an index.html become served sites: the archive is
  // unpacked into one R2 object per file under sites/{fileId}/ and served at
  // the subdomain ({slug}.nudgehost.site). Site detection is a fallback
  // decision, not a gate: an archive with no index.html stays a plain
  // downloadable file, and only genuine safety problems (traversal paths,
  // encrypted entries, nested archives) reject the upload. Extension or MIME
  // is only the hint; the magic bytes decide, so a renamed non-ZIP stays a
  // plain download.
  else if (isZipUpload(file.filename, file.mimeType)) {
    let zipBuffer: Buffer | null = null;
    try {
      const object = await r2.send(
        new GetObjectCommand({ Bucket: R2_BUCKET, Key: file.fileKey }),
      );
      if (object.Body) {
        zipBuffer = Buffer.from(await object.Body.transformToByteArray());
      }
    } catch {
      zipBuffer = null;
    }

    const scan =
      zipBuffer && hasZipMagic(zipBuffer)
        ? await scanZipForSite(zipBuffer)
        : null;

    if (scan?.kind === "unsafe") {
      // Fail closed: an unsafe archive never holds a link or a quota slot.
      // Nothing was unpacked, so only the archive and the row go.
      try {
        await r2.send(
          new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: file.fileKey }),
        );
      } catch {
        // Orphaned archive object; harmless.
      }
      await db.delete(files).where(eq(files.id, file.id));
      return NextResponse.json({ error: scan.error }, { status: 422 });
    }
    // "unreadable" and no-index archives fall through here untouched and the
    // row stays kind "file": the ZIP shares as a one-click download, bounded
    // by the normal upload size cap like any other file. The entry-count and
    // uncompressed-size ceilings below exist to bound the unpack, so they
    // apply on the site path only.

    if (zipBuffer && scan?.kind === "scanned" && scan.hasIndex) {
      // The cap applies to the total uncompressed size, on the same per-plan
      // ceiling a plain upload gets.
      let maxBytes = ANON_MAX_FILE_BYTES;
      if (userId) {
        const [account] = await db
          .select({ plan: users.plan })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);
        const plan = account?.plan ?? "free";
        maxBytes = PLAN_MAX_FILE_BYTES[plan] ?? PLAN_MAX_FILE_BYTES.free;
      }

      const result = await unpackZipToSite({
        fileId: file.id,
        zipBuffer,
        maxTotalBytes: maxBytes,
      });

      if (!result.ok) {
        // Fail closed: a rejected archive never holds a link or a quota slot.
        // Partial unpack output, the archive, and the row all go.
        try {
          await deleteSiteObjects(file.id);
        } catch {
          // Orphaned site objects; the daily cron can't see them but they're
          // unreachable (the row is gone) and a retry overwrites the prefix.
        }
        try {
          await r2.send(
            new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: file.fileKey }),
          );
        } catch {
          // Orphaned archive object; harmless.
        }
        await db.delete(files).where(eq(files.id, file.id));
        return NextResponse.json({ error: result.error }, { status: 422 });
      }

      await db
        .update(files)
        .set({
          kind: "site",
          entryPath: result.entryPath,
          updatedAt: new Date(),
        })
        .where(eq(files.id, file.id));

      if (isServableSiteLabel(file.slug)) {
        shareUrl = siteUrlForSlug(file.slug);
      }

      // Delete the original archive now that the unpacked objects are live.
      // Documented choice (see lib/site-store.ts): nothing ever reads the
      // archive again, so keeping it would double the stored bytes for every
      // site. fileKey stays on the row as a dangling pointer; deletes against
      // it are no-ops.
      try {
        await r2.send(
          new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: file.fileKey }),
        );
      } catch {
        // Orphaned archive object; harmless.
      }
    }
    // No ZIP magic: fall through and treat it as a regular file.
  }

  // Generate the og:image thumbnail after the response flushes, so the
  // "link ready" reply is never held up by image work. Best-effort: a failure
  // leaves the file without a thumbnail and the viewer uses the sitewide card.
  // For ZIPs the generator builds its card from the filename alone, so the
  // already-deleted archive object is never fetched.
  after(async () => {
    await fetchAndStoreThumbnail({
      fileId: file.id,
      fileKey: file.fileKey,
      mimeType: file.mimeType,
      filename: file.filename,
    });
  });

  return NextResponse.json({
    success: true,
    url: shareUrl,
  });
}
