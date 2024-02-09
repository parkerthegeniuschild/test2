ALTER TABLE "provider_location" ADD COLUMN "is_moving" boolean;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "battery_level" double precision;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "battery_is_charging" boolean;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "activity_type" text;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "activity_confidence" smallint;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "location_event" text;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "location_event_uuid" uuid;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "timestamp" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "odometer" double precision;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "age" bigint;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "ellipsoidal_altitude" double precision;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "altitude" double precision;--> statement-breakpoint
ALTER TABLE "provider_location" ADD COLUMN "altitude_accuracy" double precision;