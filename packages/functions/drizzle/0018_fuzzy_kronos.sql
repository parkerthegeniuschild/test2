CREATE TABLE IF NOT EXISTS "job_vehicle_contact" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_id" bigint NOT NULL,
	"type" varchar(256) NOT NULL,
	"year" smallint,
	"unit" varchar(256),
	"model" varchar(256),
	"color" varchar(256),
	"vin_serial" varchar(256),
	"usdot" varchar(256),
	"mileage" numeric,
	"manufacturer" varchar(256),
	"old_id" bigint
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_job_vehicle_contact_manufacturer" ON "job_vehicle_contact" ("manufacturer");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_contact" ADD CONSTRAINT "job_vehicle_contact_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Note: This script migrates the data from the old table 'vehicle' to the new one (and new schema), manually added
-- Note2: We saw a bug in this script, that should save old_id with the job_vehicle.id instead vehicle.id. This already ran on dev, and it is fixed in migration 0021
-- INSERT INTO job_vehicle_contact
-- (created_by, created_at, job_id, type, year, unit, model, vin_serial, usdot, mileage, manufacturer, old_id)
-- SELECT
--   'migration' AS created_by,
--   now() AS created_at,
--   job_table.id AS job_id,
--   COALESCE(d_type.value, 'UNKNOWN') AS type,
--   LEAST(vehicle.vehicle_year, 32767) AS year,
--   vehicle.vehicle_unit AS unit,
--   d_model.value AS model,
--   vehicle.vehicle_vin_serial AS vin_serial,
--   vehicle.vehicle_usdot AS usdot,
--   vehicle.vehicle_mileage AS mileage,
--   d_manufacturer.value AS manufacturer,
--   vehicle.id AS old_id
-- FROM job_table
-- LEFT JOIN job_vehicle ON job_vehicle.job_id = job_table.id
-- LEFT JOIN vehicle ON vehicle.id = job_vehicle.vehicle_id
-- LEFT JOIN dictionary d_type on d_type.id = vehicle.type_id
-- LEFT JOIN dictionary d_model on d_model.id = vehicle.model_id
-- LEFT JOIN dictionary d_manufacturer on d_manufacturer.id = vehicle.manufacturer_id
-- WHERE vehicle.id IS NOT NULL;
