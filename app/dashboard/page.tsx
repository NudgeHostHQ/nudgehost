import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { and, count, desc, eq, gt, isNull, or } from "drizzle-orm";
import QRCode from "qrcode";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { UploadWidget } from "@/components/upload-widget";
import { FileActions } from "@/components/file-actions";
import { ManageBillingButton } from "@/components/manage-billing-button";
import { AdoptAnonymousFiles } from "@/components/adopt-anonymous-files";
import { db } from "@/lib/db";
import { files as filesTable, users } from "@/lib/db/schema";
import { ANON_COOKIE_NAME, isValidAnonToken } from "@/lib/anon-upload";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your NudgeHost files, links, and account.",
  robots: { index: false, follow: false },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

// Active-file ceiling per plan. Plans not listed here are uncapped.
const PLAN_FILE_LIMIT: Record<string, number> = { free: 10 };
const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  team: "Team",
};

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type FileStatus = "active" | "expired" | "deleted";

function statusBadge(status: FileStatus) {
  const styles: Record<FileStatus, string> = {
    active: "bg-sage-light text-[#3A6E3E]",
    expired: "bg-coral-light text-coral-dark",
    deleted: "bg-charcoal/5 text-muted",
  };
  const label = { active: "Active", expired: "Expired", deleted: "Deleted" };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {label[status]}
    </span>
  );
}

export default async function DashboardPage() {
  const user = await currentUser();
  // Middleware already protects this route; this is a defensive fallback.
  if (!user) redirect("/sign-in");

  const userId = user.id;
  const greetingName =
    user.firstName ||
    user.username ||
    user.emailAddresses[0]?.emailAddress ||
    "there";

  const [account] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const plan = account?.plan ?? "free";
  const isPaid = plan === "pro" || plan === "team";

  const userFiles = await db
    .select()
    .from(filesTable)
    .where(eq(filesTable.userId, userId))
    .orderBy(desc(filesTable.createdAt));

  const now = Date.now();
  const rows = await Promise.all(
    userFiles.map(async (f) => {
      const status: FileStatus = f.isDeleted
        ? "deleted"
        : f.expiresAt && f.expiresAt.getTime() < now
          ? "expired"
          : "active";
      const url = `${SITE_URL}/f/${f.slug}`;
      // Generate the QR as a trusted SVG string on the server so we don't ship
      // a QR library to the browser. Skip deleted files (their link is dead).
      const qrSvg =
        status === "deleted"
          ? ""
          : await QRCode.toString(url, { type: "svg", margin: 1, width: 176 });
      return { file: f, status, url, qrSvg };
    }),
  );

  // Usage counts non-deleted files, matching the presign limit check.
  const activeFiles = userFiles.filter((f) => !f.isDeleted);
  const usedCount = activeFiles.length;
  const storageBytes = activeFiles.reduce((sum, f) => sum + f.fileSize, 0);
  const fileLimit = PLAN_FILE_LIMIT[plan];
  const usagePercent = fileLimit
    ? Math.min(100, Math.round((usedCount / fileLimit) * 100))
    : 0;

  // Anonymous files the adoption pass left behind because the plan was at its
  // ceiling. Counted only when the account is actually full, so the notice
  // never flashes for files the mounted adoption effect is about to sweep in.
  const cookieStore = await cookies();
  const anonCookie = cookieStore.get(ANON_COOKIE_NAME)?.value ?? "";
  const hasAnonCookie = isValidAnonToken(anonCookie);
  let leftBehind = 0;
  if (hasAnonCookie && fileLimit && usedCount >= fileLimit) {
    const [{ value }] = await db
      .select({ value: count() })
      .from(filesTable)
      .where(
        and(
          eq(filesTable.anonToken, anonCookie),
          eq(filesTable.isDeleted, false),
          or(
            isNull(filesTable.expiresAt),
            gt(filesTable.expiresAt, new Date()),
          ),
        ),
      );
    leftBehind = value;
  }

  return (
    <>
      {hasAnonCookie && <AdoptAnonymousFiles />}
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="hover:text-charcoal">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-charcoal">
              Dashboard
            </li>
          </ol>
        </nav>

        {/* HEADER + PLAN */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-1 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Hi {greetingName}.
            </h1>
            <p className="flex items-center gap-2 text-sm text-muted">
              You&apos;re on the
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isPaid ? "bg-coral-light text-coral-dark" : "bg-cream text-charcoal"
                }`}
              >
                {PLAN_LABEL[plan] ?? "Free"}
              </span>
              plan.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isPaid ? (
              <ManageBillingButton />
            ) : (
              <Link
                href="/pricing"
                className="rounded-full bg-coral px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
              >
                Upgrade plan
              </Link>
            )}
          </div>
        </header>

        {/* UPLOAD */}
        <section className="mb-8" aria-label="Upload a file">
          <UploadWidget className="w-full" />
        </section>

        {/* USAGE STATS */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2" aria-label="Usage">
          <div className="rounded-2xl border border-charcoal/10 bg-warm p-5">
            <p className="text-sm font-medium text-charcoal">
              {fileLimit ? `${usedCount} of ${fileLimit} links used` : `${usedCount} links used`}
            </p>
            {fileLimit ? (
              <>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream">
                  <div
                    className="h-full rounded-full bg-coral transition-all"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                {usedCount >= fileLimit && (
                  <p className="mt-2 text-xs text-coral-dark">
                    You&apos;ve hit the free plan limit.{" "}
                    <Link href="/pricing" className="font-medium underline">
                      Upgrade for unlimited links
                    </Link>
                    .
                  </p>
                )}
              </>
            ) : (
              <p className="mt-1 text-xs text-muted">Unlimited links on your plan.</p>
            )}
          </div>
          <div className="rounded-2xl border border-charcoal/10 bg-warm p-5">
            <p className="text-sm font-medium text-charcoal">
              {formatBytes(storageBytes)} stored
            </p>
            <p className="mt-1 text-xs text-muted">
              Across {usedCount} active {usedCount === 1 ? "file" : "files"}.
            </p>
          </div>
        </section>

        {/* FILES */}
        <section aria-label="Your files">
          <h2 className="mb-4 font-display text-xl font-semibold tracking-tight">
            Your files
          </h2>

          {leftBehind > 0 && (
            <div className="mb-4 rounded-2xl border border-coral/40 bg-coral-light px-4 py-3 text-sm text-charcoal">
              {leftBehind === 1
                ? "1 upload from before you signed in is"
                : `${leftBehind} uploads from before you signed in are`}{" "}
              not in this account because it is at its {fileLimit}-link limit.
              {leftBehind === 1 ? " It keeps" : " They keep"} the 7-day expiry
              from anonymous uploads. Delete a file and reload this page to
              bring {leftBehind === 1 ? "it" : "them"} in.
            </div>
          )}

          {userFiles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-charcoal/15 bg-warm px-6 py-14 text-center">
              <p className="font-medium text-charcoal">No files yet.</p>
              <p className="mt-1 text-sm text-muted">
                Drop a file above to get your first shareable link.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-charcoal/10">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">Your hosted files</caption>
                <thead>
                  <tr className="bg-cream text-left">
                    <th scope="col" className="px-4 py-3 font-semibold text-charcoal">
                      File
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-charcoal">
                      Link
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-charcoal">
                      Size
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-charcoal">
                      Views
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-charcoal">
                      Created
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-charcoal">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold text-charcoal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ file, status, url, qrSvg }, i) => (
                    <tr
                      key={file.id}
                      className={`${i % 2 === 0 ? "bg-warm" : "bg-cream/40"} ${
                        status === "deleted" ? "opacity-55" : ""
                      }`}
                    >
                      <th
                        scope="row"
                        className="max-w-[14rem] truncate px-4 py-3 text-left font-medium text-charcoal"
                        title={file.filename}
                      >
                        {file.filename}
                      </th>
                      <td className="px-4 py-3">
                        {status === "deleted" ? (
                          <span className="text-muted">/f/{file.slug}</span>
                        ) : (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-coral-dark underline-offset-2 hover:underline"
                          >
                            /f/{file.slug}
                          </a>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-charcoal/80">
                        {formatBytes(file.fileSize)}
                      </td>
                      <td className="px-4 py-3 text-charcoal/80">{file.viewCount}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-charcoal/80">
                        {formatDate(file.createdAt)}
                      </td>
                      <td className="px-4 py-3">{statusBadge(status)}</td>
                      <td className="px-4 py-3">
                        {status === "deleted" ? (
                          <span className="block text-right text-xs text-muted">
                            Removed
                          </span>
                        ) : (
                          <FileActions
                            fileId={file.id}
                            filename={file.filename}
                            shareUrl={url}
                            qrSvg={qrSvg}
                            hasPassword={Boolean(file.passwordHash)}
                            expiresAt={
                              file.expiresAt
                                ? file.expiresAt.toISOString().slice(0, 10)
                                : null
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
