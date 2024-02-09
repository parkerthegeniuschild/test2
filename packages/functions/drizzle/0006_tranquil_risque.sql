CREATE TABLE IF NOT EXISTS "job_comment" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_id" bigint NOT NULL,
	"comment" text NOT NULL,
	"order_num" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_job_comment_job_id" ON "job_comment" ("job_id");--> statement-breakpoint
ALTER TABLE "job_comment" DROP CONSTRAINT IF EXISTS "fk_job_comment_jobid";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_comment" ADD CONSTRAINT "job_comment_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
