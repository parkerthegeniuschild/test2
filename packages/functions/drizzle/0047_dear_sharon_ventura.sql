CREATE TABLE IF NOT EXISTS "job_payments_item" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_id" bigint NOT NULL,
	"amount_cents" integer NOT NULL,
	"payment_method" varchar(256) NOT NULL,
	"identifier" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_payments_item" ADD CONSTRAINT "job_payments_item_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
