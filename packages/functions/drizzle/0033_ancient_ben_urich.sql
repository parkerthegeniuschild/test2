CREATE TABLE IF NOT EXISTS "service_timer" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_id" bigint NOT NULL,
	"job_vehicle_contact_service_id" bigint,
	"provider_id" bigint NOT NULL,
	"start_time" timestamp with time zone DEFAULT now() NOT NULL,
	"end_time" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_timer" ADD CONSTRAINT "service_timer_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_timer" ADD CONSTRAINT "service_timer_job_vehicle_contact_service_id_job_vehicle_contact_service_id_fk" FOREIGN KEY ("job_vehicle_contact_service_id") REFERENCES "job_vehicle_contact_service"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_timer" ADD CONSTRAINT "service_timer_provider_id_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "provider"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
