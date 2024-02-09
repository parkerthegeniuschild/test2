CREATE TABLE IF NOT EXISTS "job_vehicle_contact_service" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_vehicle_contact_id" bigint NOT NULL,
	"type" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"old_id" bigint
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_contact_service" ADD CONSTRAINT "job_vehicle_contact_service_job_vehicle_contact_id_job_vehicle_contact_id_fk" FOREIGN KEY ("job_vehicle_contact_id") REFERENCES "job_vehicle_contact"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Note: This script migrates the data from the old table 'job_vehicle' to the new one (and new schema), manually added
-- Note2: This script is the fixed script, that was commented in migration 0018
DELETE FROM job_vehicle_contact WHERE old_id IS NOT NULL;
INSERT INTO job_vehicle_contact
(created_by, created_at, job_id, type, year, unit, model, vin_serial, usdot, mileage, manufacturer, old_id)
SELECT
  'migration' AS created_by,
  now() AS created_at,
  job_table.id AS job_id,
  COALESCE(d_type.value, 'UNKNOWN') AS type,
  LEAST(vehicle.vehicle_year, 32767) AS year,
  vehicle.vehicle_unit AS unit,
  d_model.value AS model,
  vehicle.vehicle_vin_serial AS vin_serial,
  vehicle.vehicle_usdot AS usdot,
  vehicle.vehicle_mileage AS mileage,
  d_manufacturer.value AS manufacturer,
  job_vehicle.id AS old_id
FROM job_table
LEFT JOIN job_vehicle ON job_vehicle.job_id = job_table.id
LEFT JOIN vehicle ON vehicle.id = job_vehicle.vehicle_id
LEFT JOIN dictionary d_type on d_type.id = vehicle.type_id
LEFT JOIN dictionary d_model on d_model.id = vehicle.model_id
LEFT JOIN dictionary d_manufacturer on d_manufacturer.id = vehicle.manufacturer_id
WHERE job_vehicle.id IS NOT NULL;

-- Note: This script migrates the data from the old table 'job_vehicle_service' to the new one (and new schema), manually added
INSERT INTO job_vehicle_contact_service
(created_by, created_at, job_vehicle_contact_id, type, description, old_id)
SELECT
  'migration' AS created_by,
  now() AS created_at,
  job_vehicle_contact.id AS job_vehicle_contact_id,
  service.description AS type,
  job_vehicle.vehicle_issue AS description,
  job_vehicle_service.id AS old_id
FROM job_vehicle
INNER JOIN job_vehicle_service ON job_vehicle_service.job_vehicle_id = job_vehicle.id
INNER JOIN service ON service.id = job_vehicle_service.service_id
INNER JOIN job_vehicle_contact ON job_vehicle_contact.old_id = job_vehicle.id;