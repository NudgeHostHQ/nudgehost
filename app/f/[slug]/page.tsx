import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Download, Clock } from "lucide-react";
import { eq, sql } from "drizzle-orm";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";
import { unlockCookieName, unlockToken } from "@/lib/file-access";
import { PasswordPrompt } from "@/components/password-prompt";

// These are live user files, not marketing pages. Keep them out of the index.
export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

type Params = Promise<{ slug: string }>;

// Cached so generateMetadata and the page share a single read per request.
const getFileBySlug = cache(async (slug: string) => {
  const [file] = await db
    .select()
    .from(files)
    .where(eq(files.slug, slug))
    .limit(1);
  return file ?? null;
});

// Expired anonymous files vanish entirely (the visitor was told the link
// lasts 7 days; afterwards it reads as never claimed). Expired owner files
// keep the explanatory "link has expired" screen below, since expiry there is
// a setting the owner chose and can clear from the dashboard.
function isExpiredAnonFile(file: {
  anonToken: string | null;
  expiresAt: Date | null;
}): boolean {
  return Boolean(
    file.anonToken && file.expiresAt && file.expiresAt.getTime() < Date.now(),
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Short-lived read URL so the bucket can stay private.
async function signedReadUrl(
  fileKey: string,
  filename: string,
  disposition: "inline" | "attachment",
): Promise<string> {
  const safeName = filename.replace(/"/g, "");
  return getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: fileKey,
      ResponseContentDisposition: `${disposition}; filename="${safeName}"`,
    }),
    { expiresIn: 3600 }, // 1 hour
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const file = await getFileBySlug(slug);

  if (!file || file.isDeleted || file.banned || isExpiredAnonFile(file)) {
    return {
      title: "File not found",
      robots: { index: false, follow: false },
    };
  }

  // Per-file og:image. The route serves the generated thumbnail, or redirects
  // to the sitewide og-image.png when there isn't one (or the file is gated).
  // The URL is stable per file, so a replacement reuses it.
  const thumbnailUrl = `${SITE_URL}/api/files/${file.id}/thumbnail`;

  return {
    title: file.filename,
    description: "Shared via NudgeHost",
    robots: { index: false, follow: false },
    openGraph: {
      title: file.filename,
      description: "Shared via NudgeHost",
      images: [
        { url: thumbnailUrl, width: 1200, height: 630, alt: file.filename },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: file.filename,
      description: "Shared via NudgeHost",
      images: [thumbnailUrl],
    },
  };
}

function ViewerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">{children}</div>
  );
}

// mailto link for flagging a file; no form or report page yet.
function reportHref(slug: string): string {
  return `mailto:support@nudgehost.com?subject=${encodeURIComponent(`Report abuse: ${slug}`)}`;
}

function ViewerHeader({
  filename,
  slug,
  downloadUrl,
}: {
  filename: string;
  slug: string;
  downloadUrl?: string;
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-charcoal/10 bg-warm/90 px-5 py-3 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/"
          className="shrink-0 font-display text-xl font-bold tracking-tight"
        >
          nudge<span className="text-coral">host</span>
        </Link>
        <span className="hidden text-charcoal/20 sm:inline" aria-hidden="true">
          /
        </span>
        <span className="hidden min-w-0 truncate text-sm font-medium text-muted sm:inline">
          {filename}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <a
          href={reportHref(slug)}
          className="text-sm text-muted transition-colors hover:text-charcoal"
        >
          Report
        </a>
        {downloadUrl && (
          <a
            href={downloadUrl}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-coral px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
          >
            <Download size={15} strokeWidth={2} aria-hidden="true" />
            Download
          </a>
        )}
      </div>
    </header>
  );
}

export default async function FileViewerPage({ params }: { params: Params }) {
  const { slug } = await params;
  const file = await getFileBySlug(slug);

  // Banned files 404 like deleted ones; the R2 object stays for 30 days as
  // evidence and the cleanup cron removes it after that.
  if (!file || file.isDeleted || file.banned || isExpiredAnonFile(file)) {
    notFound();
  }

  // Expired links stop serving but stay in the database.
  if (file.expiresAt && file.expiresAt.getTime() < Date.now()) {
    return (
      <ViewerShell>
        <ViewerHeader filename={file.filename} slug={file.slug} />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <div
            className="mb-5 flex items-center justify-center rounded-2xl bg-coral-light text-coral-dark"
            style={{ height: "56px", width: "56px" }}
            aria-hidden="true"
          >
            <Clock size={26} strokeWidth={2} />
          </div>
          <h1 className="mb-3 font-display text-3xl font-semibold tracking-tight">
            This link has expired
          </h1>
          <p className="mb-8 max-w-md text-muted">
            The person who shared this file set it to expire. Ask them to send a
            fresh link.
          </p>
          <Link
            href="/"
            className="rounded-full bg-coral px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
          >
            Share your own file
          </Link>
        </main>
      </ViewerShell>
    );
  }

  // Password gate. The unlock cookie is set by the verify-password route once
  // a visitor enters the correct password, and is tied to the current hash.
  if (file.passwordHash) {
    const cookieStore = await cookies();
    const token = cookieStore.get(unlockCookieName(file.id))?.value;
    if (token !== unlockToken(file.id, file.passwordHash)) {
      return (
        <ViewerShell>
          <ViewerHeader filename={file.filename} slug={file.slug} />
          <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
            <PasswordPrompt fileId={file.id} filename={file.filename} />
          </main>
        </ViewerShell>
      );
    }
  }

  // Count the view. A failed write should never block showing the file.
  try {
    await db
      .update(files)
      .set({ viewCount: sql`${files.viewCount} + 1` })
      .where(eq(files.id, file.id));
  } catch {
    // non-fatal
  }

  const mime = file.mimeType.toLowerCase();
  const isPdf = mime === "application/pdf";
  const isImage = mime.startsWith("image/");
  const isHtml = mime === "text/html";
  const canEmbed = isPdf || isImage || isHtml;

  const downloadUrl = await signedReadUrl(
    file.fileKey,
    file.filename,
    "attachment",
  );
  const viewUrl = canEmbed
    ? await signedReadUrl(file.fileKey, file.filename, "inline")
    : null;

  return (
    <ViewerShell>
      <ViewerHeader filename={file.filename} slug={file.slug} downloadUrl={downloadUrl} />

      {isImage && viewUrl && (
        <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={viewUrl}
            alt={file.filename}
            className="max-h-[85vh] max-w-full rounded-2xl border border-charcoal/10 bg-warm object-contain shadow-sm"
          />
        </main>
      )}

      {isPdf && viewUrl && (
        <main className="flex-1 p-0 sm:p-4">
          <object
            data={viewUrl}
            type="application/pdf"
            className="h-[88vh] w-full rounded-none border-0 sm:rounded-2xl sm:border sm:border-charcoal/10"
            aria-label={file.filename}
          >
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <p className="text-muted">
                Your browser cannot show this PDF inline.
              </p>
              <a
                href={downloadUrl}
                className="rounded-full bg-coral px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
              >
                Download the PDF
              </a>
            </div>
          </object>
        </main>
      )}

      {isHtml && viewUrl && (
        <main className="flex-1 p-0 sm:p-4">
          <iframe
            src={viewUrl}
            title={file.filename}
            sandbox="allow-scripts allow-popups allow-forms"
            className="h-[88vh] w-full rounded-none border-0 bg-white sm:rounded-2xl sm:border sm:border-charcoal/10"
          />
          {/* Attribution bar on anonymous HTML pages, gone once the file is
              adopted into an account. The hosted page renders inside the
              sandboxed iframe above, so this bar lives in the viewer document
              and can't disturb that page's own layout. pointer-events stay
              off everywhere except the wordmark link, so clicks on the rest
              of the bar fall through to the page underneath. */}
          {file.anonToken && (
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
              <div className="flex items-center justify-center gap-2.5 border-t border-line bg-cream px-4 py-2 text-[13px] text-charcoal">
                <Link
                  href="/"
                  className="pointer-events-auto font-display text-[15px] font-bold tracking-tight"
                >
                  nudge<span className="text-coral">host</span>
                </Link>
                <span className="text-muted">Hosted free on NudgeHost</span>
                <span className="text-muted" aria-hidden="true">
                  ·
                </span>
                <a
                  href={reportHref(file.slug)}
                  className="pointer-events-auto text-muted underline-offset-2 transition-colors hover:text-charcoal hover:underline"
                >
                  Report
                </a>
              </div>
            </div>
          )}
        </main>
      )}

      {!canEmbed && (
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <div
            className="mb-5 flex items-center justify-center rounded-2xl bg-coral-light text-2xl"
            style={{ height: "56px", width: "56px" }}
            aria-hidden="true"
          >
            📄
          </div>
          <h1 className="mb-2 max-w-lg break-words font-display text-2xl font-semibold tracking-tight">
            {file.filename}
          </h1>
          <p className="mb-8 text-sm text-muted">{formatBytes(file.fileSize)}</p>
          <a
            href={downloadUrl}
            className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
          >
            <Download size={18} strokeWidth={2} aria-hidden="true" />
            Download this file
          </a>
          <p className="mt-4 text-xs text-muted">Shared via NudgeHost</p>
        </main>
      )}
    </ViewerShell>
  );
}
