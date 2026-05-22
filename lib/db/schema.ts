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
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// One row per uploaded file. fileKey is the R2 object key, slug is the short
// public URL segment, is_deleted is a soft-delete flag.
export const files = pgTable(
  "files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    filename: text("filename").notNull(),
    fileKey: text("file_key").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: text("mime_type").notNull(),
    slug: text("slug").notNull().unique(),
    passwordHash: text("password_hash"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    viewCount: integer("view_count").notNull().default(0),
    isDeleted: boolean("is_deleted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("files_user_id_idx").on(table.userId),
    index("files_slug_idx").on(table.slug),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
