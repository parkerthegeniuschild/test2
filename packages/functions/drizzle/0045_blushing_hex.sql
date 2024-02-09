ALTER TABLE "provider" ADD COLUMN "_version" integer DEFAULT 1 NOT NULL;

-- Note: This script creates missing rows for provider_rates table, manually added
-- This one fix callout rate
INSERT INTO provider_rate
(created_by, provider_id, rate_id, value)
SELECT
  'migration' AS created_by,
  provider.id AS provider_id,
  1042 AS rate_id,
  '25' AS value
FROM provider
LEFT JOIN provider_rate ON provider_rate.provider_id = provider.id AND provider_rate.rate_id = 1042
WHERE provider_rate.id IS NULL;

-- This one fix hourly rate
INSERT INTO provider_rate
(created_by, provider_id, rate_id, value)
SELECT
  'migration' AS created_by,
  provider.id AS provider_id,
  1041 AS rate_id,
  '65' AS value
FROM provider
LEFT JOIN provider_rate ON provider_rate.provider_id = provider.id AND provider_rate.rate_id = 1041
WHERE provider_rate.id IS NULL;