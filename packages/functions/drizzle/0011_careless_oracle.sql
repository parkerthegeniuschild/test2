ALTER TABLE "app_user" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app_user" ALTER COLUMN "app_role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "userOtp" ADD COLUMN "challengeHash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "userOtp" ADD COLUMN "strikes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "userOtp" ADD COLUMN "lastAttempt" integer;