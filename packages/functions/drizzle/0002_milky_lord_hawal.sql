ALTER TABLE "provider" DROP CONSTRAINT "provider_company_id_company_id_fk";
--> statement-breakpoint
ALTER TABLE "provider" DROP COLUMN IF EXISTS "company_id";