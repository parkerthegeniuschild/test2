CREATE TABLE IF NOT EXISTS "sent_invoice" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_id" bigint NOT NULL,
	"email_from" varchar(256) NOT NULL,
	"email_to" varchar(256) NOT NULL,
	"subject" varchar(256) NOT NULL,
	"body" varchar(256) NOT NULL,
	"sent_by_id" bigint NOT NULL,
	"sent_at" timestamp with time zone,
	"status" varchar(256) DEFAULT 'GENERATING' NOT NULL,
	"file" varchar(256)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sent_invoice" ADD CONSTRAINT "sent_invoice_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sent_invoice" ADD CONSTRAINT "sent_invoice_sent_by_id_app_user_id_fk" FOREIGN KEY ("sent_by_id") REFERENCES "app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
