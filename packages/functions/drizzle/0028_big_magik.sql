ALTER TABLE "job_vehicle_contact_service" ADD COLUMN "service_id" bigint;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_contact_service" ADD CONSTRAINT "job_vehicle_contact_service_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Note: This script migrates fill the new column 'service_id' from the table 'job_vehicle_contact_service' based on the job_vehicle_contact_service.type, manually added
UPDATE job_vehicle_contact_service SET service_id = (SELECT jvs.service_id FROM job_vehicle_service jvs WHERE jvs.id = old_id) WHERE old_id IS NOT NULL;
UPDATE job_vehicle_contact_service SET service_id = (SELECT service.id FROM service WHERE service.name = type) WHERE old_id IS NULL AND type IS NOT NULL AND type <> '';
