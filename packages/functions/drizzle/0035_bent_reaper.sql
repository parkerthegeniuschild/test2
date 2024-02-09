ALTER TABLE "service_timer" ADD COLUMN "old_id" bigint;

-- Note: This script migrates the data from the old table 'job_labor' to the new one 'service_timer' (and new schema), manually added
INSERT INTO service_timer (created_by, created_at, updated_by, updated_at, job_id, provider_id, start_time, end_time, old_id)
SELECT created_by, created_at, updated_by, updated_at, job_id, provider_id, start_time, end_time, id AS old_id FROM job_labor
WHERE job_labor.id NOT IN (SELECT DISTINCT old_id FROM service_timer WHERE old_id IS NOT NULL);
