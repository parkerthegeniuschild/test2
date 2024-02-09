CREATE TABLE IF NOT EXISTS "job_vehicle_service" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_vehicle_id" bigint NOT NULL,
	"service_id" bigint NOT NULL,
	"status_id" bigint,
	"cost" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_vehicle_service_photo" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_vehicle_service_id" bigint NOT NULL,
	"content_type" varchar(256) NOT NULL,
	"url" varchar(256) NOT NULL,
	"filename" varchar(256) NOT NULL,
	"order_num" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_vehicle_service_uk" ON "job_vehicle_service" ("job_vehicle_id","service_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_photo_uk" ON "job_vehicle_service_photo" ("job_vehicle_service_id");--> statement-breakpoint
ALTER TABLE "job_vehicle_service" DROP CONSTRAINT IF EXISTS "fk_job_vehicle_service_comment_job_vehicle_service_id";--> statement-breakpoint
ALTER TABLE "job_vehicle_service" DROP CONSTRAINT IF EXISTS "fk_job_vehicle_service_service_id";--> statement-breakpoint
ALTER TABLE "job_vehicle_service_photo" DROP CONSTRAINT IF EXISTS "fk_job_photo_job_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_service" ADD CONSTRAINT "job_vehicle_service_job_vehicle_id_job_vehicle_id_fk" FOREIGN KEY ("job_vehicle_id") REFERENCES "job_vehicle"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_service" ADD CONSTRAINT "job_vehicle_service_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_service_photo" ADD CONSTRAINT "job_vehicle_service_photo_job_vehicle_service_id_job_vehicle_service_id_fk" FOREIGN KEY ("job_vehicle_service_id") REFERENCES "job_vehicle_service"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
