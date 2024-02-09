ALTER TABLE "dispatcher" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dispatcher" ALTER COLUMN "company_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "dispatcher" ALTER COLUMN "company_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "dispatcher" ALTER COLUMN "type_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "dispatcher" ADD COLUMN "secondary_phone" varchar(256);