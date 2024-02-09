ALTER TABLE "provider" ADD COLUMN "location_precise" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "provider" ADD COLUMN "location_always" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "provider" ADD COLUMN "notifications" boolean DEFAULT false NOT NULL;

-- Note: This script initializes null columns to false, manually added
UPDATE "provider" SET "location_precise" = false WHERE "location_precise" IS NULL;
UPDATE "provider" SET "location_always" = false WHERE "location_always" IS NULL;
UPDATE "provider" SET "notifications" = false WHERE "notifications" IS NULL; 