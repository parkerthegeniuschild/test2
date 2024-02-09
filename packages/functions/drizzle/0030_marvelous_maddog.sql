ALTER TABLE "provider" ALTER COLUMN "provider_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "provider" ALTER COLUMN "rating" SET DEFAULT '0.0';--> statement-breakpoint
ALTER TABLE "provider" ALTER COLUMN "rating" SET NOT NULL;