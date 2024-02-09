ALTER TABLE "job_table" ALTER COLUMN "charge_callout_cents" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "charge_rate_cents" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "job_table" ALTER COLUMN "charge_fuel_surcharge_cents" DROP DEFAULT;