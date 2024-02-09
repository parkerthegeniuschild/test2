DO $$ BEGIN
 ALTER TABLE "job_table" ADD COLUMN "payment_sum" numeric DEFAULT '0' NOT NULL;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;
-- ALTER TABLE "job_table" ADD COLUMN "payment_sum" numeric DEFAULT '0' NOT NULL;
