/* Note: This script finds duplicate email addresses in "app_user", and append _DUPE_[ID] to each email except the most recent entry.
It does not handle NULL values or where email address casing is different. 
*/
UPDATE app_user
SET email = email || '_DUPE_' || app_user.id
FROM (
    SELECT
        id,
        ROW_NUMBER() OVER (PARTITION BY email ORDER BY id DESC) AS row_num
    FROM app_user
    WHERE email IS NOT NULL
) AS duplicates
WHERE app_user.id = duplicates.id
AND duplicates.row_num > 1;

ALTER TABLE "provider" ADD COLUMN "address_two" text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_unique" ON "app_user" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_phone_unique" ON "app_user" ("phone");
