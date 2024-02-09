ALTER TABLE "job_vehicle_contact_service" ADD COLUMN "provider_id" bigint;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_contact_service" ADD CONSTRAINT "job_vehicle_contact_service_provider_id_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "provider"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
