ALTER TABLE "transaction_log" ADD COLUMN "balance_cents" bigint;

--> statement-breakpoint
/* This migration was manually added to seed provider balances
 * into the initial transactions. We are running this
 * before additional transaction rows have been created
*/
UPDATE "transaction_log"
SET "balance_cents" = "provider"."balance" * 100
FROM "provider"
WHERE
    "transaction_log"."provider_id" = "provider"."id"
    AND "transaction_log"."balance_cents" IS NULL;

--> statement-breakpoint
/* Add the Default constraint that we removed from the first line of this migration
*/
ALTER TABLE "transaction_log" ALTER COLUMN "balance_cents" SET NOT NULL;
