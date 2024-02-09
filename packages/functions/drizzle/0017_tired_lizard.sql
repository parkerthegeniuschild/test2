ALTER TABLE "request" ALTER COLUMN "provider_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "request" ALTER COLUMN "response_time" DROP NOT NULL;