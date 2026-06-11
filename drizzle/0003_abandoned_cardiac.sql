CREATE TABLE "upload_rate_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "anon_token" text;--> statement-breakpoint
CREATE INDEX "upload_rate_events_ip_hash_idx" ON "upload_rate_events" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE INDEX "files_anon_token_idx" ON "files" USING btree ("anon_token");