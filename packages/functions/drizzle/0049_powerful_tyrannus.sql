ALTER TABLE "job_payments_item" ADD COLUMN "stripe_payment_id" text;--> statement-breakpoint
ALTER TABLE "job_payments_item" ADD COLUMN "provider_id" bigint;--> statement-breakpoint
ALTER TABLE "job_table" ADD COLUMN "location_street" text;--> statement-breakpoint
ALTER TABLE "job_table" ADD COLUMN "location_street_number" text;--> statement-breakpoint
ALTER TABLE "job_table" ADD COLUMN "location_zip" text;--> statement-breakpoint
ALTER TABLE "job_table" ADD COLUMN "invoice_message" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_payments_item" ADD CONSTRAINT "job_payments_item_provider_id_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "provider"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "job_payments_item" ADD CONSTRAINT "job_payments_item_stripe_payment_id_unique" UNIQUE("stripe_payment_id");