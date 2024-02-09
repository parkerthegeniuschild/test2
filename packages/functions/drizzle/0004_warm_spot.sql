ALTER TABLE "provider" ALTER COLUMN "firstname" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "provider" ALTER COLUMN "lastname" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "provider" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "provider" ADD COLUMN "company_id" bigint;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider" ADD CONSTRAINT "provider_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
