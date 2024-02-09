CREATE TABLE IF NOT EXISTS "job_earnings_item" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_id" bigint NOT NULL,
	"provider_id" bigint NOT NULL,
	"description" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price_cents" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_earnings_item" ADD CONSTRAINT "job_earnings_item_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_earnings_item" ADD CONSTRAINT "job_earnings_item_provider_id_job_table_id_fk" FOREIGN KEY ("provider_id") REFERENCES "job_table"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
