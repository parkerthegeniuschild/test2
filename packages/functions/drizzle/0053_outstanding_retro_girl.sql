ALTER TABLE "job_table" ADD COLUMN "charge_callout_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ADD COLUMN "charge_rate_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ADD COLUMN "charge_fuel_surcharge_cents" integer DEFAULT 0 NOT NULL;

-- Note: This script populates the data from the template table 'service_area_rate' to the new columns, manually added
UPDATE job_table
SET
  charge_callout_cents = job_rate.rateCallOu,
  charge_rate_cents = job_rate.rateHourly,
  charge_fuel_surcharge_cents = job_rate.rateFuelSr
FROM (
  SELECT
    (SELECT value * 100 FROM service_area_rate WHERE area_rate_id = 1022 and area_id = 2) AS rateFuelSr,
    (SELECT value * 100 FROM service_area_rate WHERE area_rate_id = 1023 and area_id = 2) AS rateCallOu,
    (SELECT value * 100 FROM service_area_rate WHERE area_rate_id = 1024 and area_id = 2) AS rateHourly
) AS job_rate