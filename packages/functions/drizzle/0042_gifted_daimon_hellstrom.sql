ALTER TABLE "job_table" ADD COLUMN "provider_callout_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "job_table" ADD COLUMN "provider_rate_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "job_vehicle_contact_service" ADD COLUMN "rate_cents" integer DEFAULT 0 NOT NULL;

-- Note: This script migrates the data from the template table 'provider_rate' to the new columns, manually added
UPDATE job_table
SET provider_callout_cents = prValues.callout, provider_rate_cents = prValues.rate
FROM (
    SELECT
    DISTINCT provider_id,
    (SELECT value * 100 FROM provider_rate AS prCallout WHERE prCallout.provider_id = provider_rate.provider_id AND prCallout.rate_id = 1042) AS callout,
    (SELECT value * 100 FROM provider_rate AS prRate WHERE prRate.provider_id = provider_rate.provider_id AND prRate.rate_id = 1041) AS rate
    FROM provider_rate
) AS prValues
WHERE job_table.provider_id = prValues.provider_id;

-- Note: This script migrates the data from the template table 'service' to the new columns, manually added
UPDATE job_vehicle_contact_service
SET rate_cents = (service.rate_value * 100)
FROM service
WHERE job_vehicle_contact_service.service_id = service.id
