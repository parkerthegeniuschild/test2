CREATE INDEX IF NOT EXISTS "job_created_at" ON "job_table" ("created_at");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_table" ADD CONSTRAINT "job_table_provider_id_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "provider"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
