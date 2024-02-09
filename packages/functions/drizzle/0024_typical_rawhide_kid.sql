CREATE TABLE IF NOT EXISTS "provider_position" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"provider_location_id" bigint NOT NULL,
	"position" GEOGRAPHY(POINT, 4326) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider_position" ADD CONSTRAINT "provider_position_id_provider_id_fk" FOREIGN KEY ("id") REFERENCES "provider"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider_position" ADD CONSTRAINT "provider_position_provider_location_id_provider_location_id_fk" FOREIGN KEY ("provider_location_id") REFERENCES "provider_location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Note: This script copy the recent row each provider from 'provider_location' to the new table 'provider_position' that handle the geography data. Manually added
INSERT INTO provider_position (id, created_by, provider_location_id, position)
SELECT
  P.provider_id AS id,
  'migration' AS created_by,
  P.id AS provider_location_id,
  ST_GeogFromText('SRID=4326;POINT(' || P.longitude || ' ' || P.latitude || ')') AS position
FROM (
  SELECT provider_id, MAX(id) AS max_id FROM provider_location GROUP BY provider_id
) D
JOIN provider_location P ON P.id = max_id
WHERE P.provider_id NOT IN (SELECT id FROM provider_position)
