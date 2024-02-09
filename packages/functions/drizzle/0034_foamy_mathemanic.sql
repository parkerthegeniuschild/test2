CREATE TABLE IF NOT EXISTS "transaction_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"type" varchar NOT NULL,
	"source" varchar NOT NULL,
	"job_id" bigint,
	"provider_id" bigint NOT NULL,
	"amount_cents" integer NOT NULL,
	"notes" varchar
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_transaction_log_provider_id" ON "transaction_log" ("provider_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_provider_id_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "provider"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
/* This migration was manually added to create the initial balance record for providers with non-zero balance
*/
INSERT INTO transaction_log (provider_id, created_by, source, type, amount_cents)
SELECT
    id AS provider_id,
	'migration' AS created_by,
    'PROVIDER_INITIAL_BALANCE' AS source,
    CASE WHEN balance >= 0 THEN 'CREDIT' ELSE 'DEBIT' END AS type,
	ABS(balance * 100) AS amount_cents
FROM provider
WHERE balance <> 0;
