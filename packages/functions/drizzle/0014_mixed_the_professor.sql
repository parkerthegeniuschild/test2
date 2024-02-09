CREATE TABLE IF NOT EXISTS "job_driver_contact" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"firstname" varchar(256) NOT NULL,
	"lastname" varchar(256),
	"phone" varchar(256) NOT NULL,
	"secondary_phone" varchar(256),
	"email" varchar(256),
	"company_id" bigint,
	"job_id" bigserial NOT NULL,
	"old_id" bigserial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_driver_contact" ADD CONSTRAINT "job_driver_contact_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Note: This script migrates the data from the old table 'driver' to the new one (and new schema), manually added
INSERT INTO job_driver_contact
(created_by, created_at, firstname, lastname, phone, email, company_id, job_id, old_id)
SELECT
  'migration' as created_by,
  now() as created_at,
  firstname, lastname, phone, email,
  driver.company_id AS company_id,
  job_table.id AS job_id,
  driver.id AS old_id
FROM job_table
LEFT JOIN job_vehicle ON job_vehicle.job_id = job_table.id
LEFT JOIN vehicle_driver ON vehicle_driver.vehicle_id = job_vehicle.vehicle_id
LEFT JOIN driver ON driver.id = vehicle_driver.driver_id
WHERE driver.id NOT IN (SELECT DISTINCT old_id FROM job_driver_contact) AND driver.id IS NOT NULL