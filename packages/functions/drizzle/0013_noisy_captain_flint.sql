-- Note: 'Alter type' commented manually to avoid errors with enum types in the migration
-- ALTER TYPE "job_status" ADD VALUE 'DRAFT';--> statement-breakpoint
ALTER TABLE "driver" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "service_area_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "location_address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "location_state" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "location_city" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "location_details" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "location_latitude" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "location_longitude" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "is_pending_review" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "status_id" SET DEFAULT 'DRAFT';--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "status_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "total_cost" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "payment_refnumber" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "promised_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "provider_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "payment_sum" DROP NOT NULL;