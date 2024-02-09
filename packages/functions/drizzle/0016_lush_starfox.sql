ALTER TABLE "job_driver_contact" ALTER COLUMN "old_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "job_driver_contact" ALTER COLUMN "old_id" DROP NOT NULL;
ALTER TABLE "job_driver_contact" ALTER COLUMN "old_id" DROP DEFAULT;