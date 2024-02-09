CREATE TABLE IF NOT EXISTS "job_leave_reason" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reason" varchar(256) NOT NULL,
	"job_id" bigint NOT NULL
);
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "job_table" ADD COLUMN "is_abandoned" boolean DEFAULT false;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "job_leave_reason" ADD CONSTRAINT "job_leave_reason_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
