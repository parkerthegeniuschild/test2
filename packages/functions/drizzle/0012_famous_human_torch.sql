DO $$ BEGIN
 ALTER TABLE "provider_rate" ADD COLUMN "value" numeric DEFAULT '0' NOT NULL;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;