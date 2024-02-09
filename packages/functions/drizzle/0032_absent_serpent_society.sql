ALTER TABLE "job_vehicle_contact_service" ADD COLUMN "status" varchar(256) DEFAULT 'READY' NOT NULL;--> statement-breakpoint
ALTER TABLE "job_vehicle_contact_service" DROP COLUMN IF EXISTS "type";