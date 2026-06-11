ALTER TABLE "files" ADD COLUMN "kind" text DEFAULT 'file' NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "entry_path" text;