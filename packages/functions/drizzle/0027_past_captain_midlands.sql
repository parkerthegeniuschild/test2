CREATE TABLE IF NOT EXISTS "job_photo" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_id" bigint NOT NULL,
	"vehicle_id" bigint NOT NULL,
	"content_type" text NOT NULL,
	"content_encoding" text,
	"url" text,
	"path" text,
	"filename" text,
	"height" integer,
	"width" integer,
	"source_path" text,
	"source_height" integer,
	"source_width" integer,
	"is_optimized" boolean,
	"user_id" bigint,
	"old_id" bigint
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_photo" ADD CONSTRAINT "job_photo_job_id_job_table_id_fk" FOREIGN KEY ("job_id") REFERENCES "job_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_photo" ADD CONSTRAINT "job_photo_vehicle_id_job_vehicle_contact_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "job_vehicle_contact"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_photo" ADD CONSTRAINT "job_photo_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Note: This script migrates and transforms the data from the old table 'job_vehicle_service_photo' to the new one 'job_photo', manually added
INSERT INTO job_photo (
        created_by,
        created_at,
        updated_by,
        updated_at,
        job_id,
        vehicle_id,
        url,
        filename,
        content_type,
        user_id,
        old_id
    )
SELECT P.created_by AS created_by,
    P.created_at AS created_at,
    P.updated_by AS updated_by,
    P.updated_at AS updated_at,
    J.id AS job_id,
    V.id AS vehicle_id,
    P.url AS url,
    P.filename AS filename,
    P.content_type AS content_type,
    U.id AS user_id,
    P.id AS old_id
FROM job_vehicle_service_photo P
    INNER JOIN job_vehicle_contact_service S ON S.old_id = P.job_vehicle_service_id
    INNER JOIN job_vehicle_contact V on V.id = S.job_vehicle_contact_id
    INNER JOIN job_table J on J.id = V.job_id
    LEFT JOIN job_photo on job_photo.old_id = P.id
    LEFT JOIN app_user U on U.username = P.created_by
WHERE job_photo.old_id IS NULL