CREATE TABLE IF NOT EXISTS "job_vehicle_comment" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_id" bigint NOT NULL,
	"vehicle_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"role" varchar(32) NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_job_vehicle_comment_job_id" ON "job_vehicle_comment" ("job_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_comment" ADD CONSTRAINT "job_vehicle_comment_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_comment" ADD CONSTRAINT "job_vehicle_comment_vehicle_id_job_vehicle_contact_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "job_vehicle_contact"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_comment" ADD CONSTRAINT "job_vehicle_comment_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
