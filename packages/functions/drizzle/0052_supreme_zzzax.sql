ALTER TABLE "job_vehicle_contact" ALTER COLUMN "type" DROP NOT NULL;

-- Note: added migration to change types, with empty string, to null
UPDATE job_vehicle_contact SET type = NULL WHERE type = '';