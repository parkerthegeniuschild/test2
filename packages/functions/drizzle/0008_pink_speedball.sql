ALTER TABLE "company" ALTER COLUMN "phone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "company" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "company" ADD COLUMN "address1" varchar(256);--> statement-breakpoint
ALTER TABLE "company" ADD COLUMN "address2" varchar(256);--> statement-breakpoint
ALTER TABLE "company" ADD COLUMN "city" varchar(256);--> statement-breakpoint
ALTER TABLE "company" ADD COLUMN "state" varchar(100);--> statement-breakpoint
ALTER TABLE "company" ADD COLUMN "zipcode" varchar(20);--> statement-breakpoint
ALTER TABLE "company" ADD COLUMN "country" varchar(80);