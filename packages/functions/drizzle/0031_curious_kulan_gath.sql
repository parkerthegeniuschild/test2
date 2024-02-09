ALTER TABLE "job_vehicle_comment" ADD COLUMN "edited_at" timestamp with time zone;--> statement-breakpoint

/* Note: This is a manual migration that we use, to set the initial edited_at column for past comments
*/
UPDATE job_vehicle_comment
SET edited_at = updated_at
WHERE updated_at IS NOT NULL;
