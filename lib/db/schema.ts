import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// Account records. id stores the Clerk user ID so we don't carry a second
// surrogate key; plan tracks free/pro/team for billing gates.
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  plan: text("plan").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// One row per uploaded file. fileKey is the R2 object key, slug is the short
// public URL segment, is_deleted is a soft-delete flag.
//
// Ownership is exactly one of userId (signed-in upload) or anonToken
// (anonymous upload, matched against the visitor's httpOnly cookie). The
// either-or rule is enforced in the presign route, not by a DB constraint.
export const files = pgTable(
  "files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => users.id),
    anonToken: text("anon_token"),
    filename: text("filename").notNull(),
    fileKey: text("file_key").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: text("mime_type").notNull(),
    // R2 key for the generated 1200x630 og:image thumbnail, or null when one
    // could not be generated (the public viewer then falls back to the
    // sitewide og-image.png). See lib/generate-thumbnail.ts.
    thumbnailKey: text("thumbnail_key"),
    slug: text("slug").notNull().unique(),
    passwordHash: text("password_hash"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    viewCount: integer("view_count").notNull().default(0),
    isDeleted: boolean("is_deleted").notNull().default(false),
    // Abuse takedown, operated via POST /api/admin/ban. A banned file 404s
    // everywhere but its R2 object is kept for 30 days as evidence; the
    // cleanup cron hard-deletes it after that.
    banned: boolean("banned").notNull().default(false),
    bannedAt: timestamp("banned_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("files_user_id_idx").on(table.userId),
    index("files_slug_idx").on(table.slug),
    index("files_anon_token_idx").on(table.anonToken),
  ],
);

// One row per anonymous presign attempt, used for the per-IP rate limit on
// anonymous uploads. ipHash is sha256(ip) so raw addresses are never stored.
// Rows older than the rate window are cleared opportunistically on each check.
export const uploadRateEvents = pgTable(
  "upload_rate_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("upload_rate_events_ip_hash_idx").on(table.ipHash, table.createdAt),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
