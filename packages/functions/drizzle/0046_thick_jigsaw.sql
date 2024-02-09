CREATE TABLE IF NOT EXISTS "job_invoice" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_id" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sent_invoice" DROP CONSTRAINT "sent_invoice_job_id_job_table_id_fk";
--> statement-breakpoint
ALTER TABLE "sent_invoice" ADD COLUMN "job_invoice_id" bigint NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_id_unique" ON "job_invoice" ("job_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sent_invoice" ADD CONSTRAINT "sent_invoice_job_invoice_id_job_invoice_id_fk" FOREIGN KEY ("job_invoice_id") REFERENCES "job_invoice"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "sent_invoice" DROP COLUMN IF EXISTS "job_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_invoice" ADD CONSTRAINT "job_invoice_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
