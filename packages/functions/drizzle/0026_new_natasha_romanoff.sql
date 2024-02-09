CREATE TABLE IF NOT EXISTS "job_vehicle_contact_service_part" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"provider_id" bigint,
	"job_vehicle_contact_service_id" bigint NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"quantity" smallint,
	"price" numeric,
	"markup" smallint,
	"old_id" bigint
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_contact_service_part" ADD CONSTRAINT "job_vehicle_contact_service_part_provider_id_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "provider"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_contact_service_part" ADD CONSTRAINT "job_vehicle_contact_service_part_job_vehicle_contact_service_id_job_vehicle_contact_service_id_fk" FOREIGN KEY ("job_vehicle_contact_service_id") REFERENCES "job_vehicle_contact_service"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Note: This script migrates the data from the old table 'job_vehicle_service_part' to the new one 'job_vehicle_contact_service_part' (and new schema), manually added
INSERT INTO job_vehicle_contact_service_part
(created_by, created_at, job_vehicle_contact_service_id, name, description, quantity, price, markup, old_id)
SELECT
  'migration' AS created_by,
  now() AS created_at,
  job_vehicle_contact_service.id AS job_vehicle_contact_service_id,
  dictionary.value AS name,
  job_vehicle_service_part.description AS description,
  job_vehicle_service_part.quantity AS quantity,
  job_vehicle_service_part.price AS price,
  job_vehicle_service_part.markup AS markup,
  job_vehicle_service_part.id AS old_id
FROM job_vehicle_contact_service
INNER JOIN job_vehicle_service_part ON job_vehicle_service_part.job_vehicle_service_id = job_vehicle_contact_service.old_id
INNER JOIN service_common_part ON service_common_part.id = job_vehicle_service_part.service_common_part_id
INNER JOIN dictionary ON dictionary.id = service_common_part.part_id
WHERE job_vehicle_contact_service.old_id IS NOT NULL AND job_vehicle_service_part.id NOT IN (SELECT DISTINCT old_id from job_vehicle_contact_service_part WHERE old_id IS NOT NULL)