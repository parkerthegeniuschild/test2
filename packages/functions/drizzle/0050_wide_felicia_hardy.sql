ALTER TABLE "job_vehicle_contact_service_part" ADD COLUMN "price_cents" bigint;

-- Note: added migration to set the price_cents for existing rows with price
UPDATE "job_vehicle_contact_service_part"
SET "price_cents" = CEIL("price" * 100)
WHERE "price_cents" IS NULL
    AND "price" IS NOT NULL
