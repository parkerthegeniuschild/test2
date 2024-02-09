ALTER TABLE "job_vehicle_contact" ADD COLUMN "created_by_id" bigint;--> statement-breakpoint
ALTER TABLE "job_vehicle_contact" ADD COLUMN "created_by_role" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_vehicle_contact" ADD CONSTRAINT "job_vehicle_contact_created_by_id_app_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

/* This is a manual migration to set the created_by_id and created_by_role for existing rows
*/
-- migrate rows that have an old_id
UPDATE "job_vehicle_contact" AS jvc
SET
    "created_by_id" = COALESCE(au."id", fallback."id"),
    "created_by_role" = COALESCE(au."app_role", 'ROLE_AGENT')
FROM
    "job_vehicle" AS jv
LEFT JOIN
    "app_user" AS au ON jv."created_by" = au."username"
LEFT JOIN
    ( SELECT "id" FROM "app_user" WHERE "app_role" = 'ROLE_AGENT' ORDER BY "id" LIMIT 1 ) AS fallback ON true
WHERE
    jvc."old_id" = jv."id" AND jvc."created_by_id" IS NULL;

-- update any records with created_by matching a username
UPDATE "job_vehicle_contact" AS jvc
SET
    "created_by_id" = COALESCE(au."id", fallback."id"),
    "created_by_role" = COALESCE(au."app_role", fallback."app_role")
FROM
    "app_user" AS au
LEFT JOIN
    ( SELECT "id", "app_role" FROM "app_user" WHERE "app_role" = 'ROLE_AGENT' ORDER BY "id" LIMIT 1 ) AS fallback ON true
WHERE
    jvc."created_by" = au."username" AND jvc."created_by_id" IS NULL;

-- update any remaining records
UPDATE "job_vehicle_contact" AS jvc
SET
    "created_by_id" = fallback."id",
    "created_by_role" = fallback."app_role"
FROM
    ( SELECT "id", "app_role" FROM "app_user" WHERE "app_role" = 'ROLE_AGENT' ORDER BY "id" LIMIT 1 ) AS fallback
WHERE
    jvc."created_by_id" IS NULL;

/* Set the NULL constraint now that we have filled existing values
*/
ALTER TABLE "job_vehicle_contact" ALTER COLUMN "created_by_id" SET NOT NULL;
ALTER TABLE "job_vehicle_contact" ALTER COLUMN "created_by_role" SET NOT NULL;
