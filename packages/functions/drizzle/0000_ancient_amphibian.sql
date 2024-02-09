CREATE EXTENSION IF NOT EXISTS postgis;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "job_status" AS ENUM('UNASSIGNED', 'NOTIFYING', 'ACCEPTED', 'MANUAL', 'PAUSE', 'IN_PROGRESS', 'COMPLETED_PENDING_REVIEW', 'CANCELED_PENDING_REVIEW', 'COMPLETED', 'CANCELED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "agreementType" AS ENUM('provider', 'driver');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app_user" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"username" text,
	"password" text,
	"email" text,
	"phone" text,
	"last_login_at" timestamp with time zone,
	"app_role" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "company" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"name" varchar(256) NOT NULL,
	"phone" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"usdot" varchar(256),
	"type" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dispatcher" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"firstname" varchar(256) NOT NULL,
	"lastname" varchar(256),
	"is_no_text_messages" boolean DEFAULT false NOT NULL,
	"phone" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"company_id" bigserial NOT NULL,
	"type_id" bigserial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"firstname" varchar(256) NOT NULL,
	"lastname" varchar(256),
	"is_no_text_messages" boolean DEFAULT false NOT NULL,
	"phone" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"company_id" bigserial NOT NULL,
	"app_user_id" bigserial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "request" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"dispatcher_id" bigint,
	"provider_id" bigint,
	"service_area_id" bigint NOT NULL,
	"location_address" varchar(256) NOT NULL,
	"location_state" varchar(256) NOT NULL,
	"location_city" varchar(256) NOT NULL,
	"location_details" varchar(256) NOT NULL,
	"location_notes" varchar(256),
	"location_latitude" double precision NOT NULL,
	"location_longitude" double precision NOT NULL,
	"response_time" timestamp with time zone NOT NULL,
	"job_id" bigint NOT NULL,
	"status" varchar(256) NOT NULL,
	"distance" double precision,
	"duration" double precision
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_table" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"dispatcher_id" bigint,
	"service_area_id" bigint NOT NULL,
	"company_id" bigint,
	"location_address" varchar(256) NOT NULL,
	"location_state" varchar(256) NOT NULL,
	"location_city" varchar(256) NOT NULL,
	"location_details" varchar(256) NOT NULL,
	"location_notes" varchar(256),
	"location_type" varchar(256),
	"location_latitude" double precision NOT NULL,
	"location_longitude" double precision NOT NULL,
	"is_pending_review" boolean DEFAULT true NOT NULL,
	"rating" bigint,
	"status_id" varchar(256) DEFAULT 'UNASSIGNED' NOT NULL,
	"total_cost" numeric DEFAULT '0' NOT NULL,
	"payment_method" varchar(256),
	"payment_refnumber" varchar(256) NOT NULL,
	"promised_time" timestamp with time zone NOT NULL,
	"provider_id" bigint NOT NULL,
	"payment_sum" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_vehicle" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"job_id" bigint NOT NULL,
	"vehicle_id" bigint NOT NULL,
	"vehicle_issue" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "LegalAgreement" (
	"createdAt" bigint DEFAULT ROUND(EXTRACT(EPOCH FROM current_timestamp) * 1000) NOT NULL,
	"acceptedAt" bigint NOT NULL,
	"type" text NOT NULL,
	"providerId" bigint,
	"driverId" bigint,
	"documentPublishedAt" bigint NOT NULL,
	"documentTitle" text NOT NULL,
	"documentType" text NOT NULL,
	"documentRevisionNo" integer NOT NULL,
	"legalDocumentId" text NOT NULL,
	"locationTemp" text NOT NULL,
	"deviceIpAddress" text NOT NULL,
	"deviceSystemVersion" text NOT NULL,
	"deviceSystemName" text NOT NULL,
	CONSTRAINT LegalAgreement_providerId_legalDocumentId_documentRevisionNo PRIMARY KEY("providerId","legalDocumentId","documentRevisionNo")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "legalDocument" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"createdBy" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedBy" varchar(256),
	"updatedAt" timestamp with time zone,
	"title" varchar(256) NOT NULL,
	"revision" bigserial NOT NULL,
	"publishedAt" timestamp with time zone,
	"legalText" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "legalDocumentVersion" (
	"legalDocumentId" varchar(32) NOT NULL,
	"createdBy" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedBy" varchar(256),
	"updatedAt" timestamp with time zone,
	"revision" integer NOT NULL,
	"publishedAt" timestamp with time zone NOT NULL,
	"contentfulId" varchar(32) NOT NULL,
	"contentfulContentType" varchar(256) NOT NULL,
	CONSTRAINT legalDocumentVersion_legalDocumentId_revision PRIMARY KEY("legalDocumentId","revision")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider_location" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"provider_id" bigint NOT NULL,
	"speed" double precision DEFAULT 0,
	"speed_accuracy" double precision,
	"vertical_accuracy" numeric,
	"course_accuracy" double precision,
	"course" double precision,
	"longitude" double precision,
	"latitude" double precision,
	"accuracy" double precision,
	"job_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider_metric" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"provider_id" bigint NOT NULL,
	"metric_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider_rate" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"provider_id" bigint NOT NULL,
	"rate_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"firstname" text,
	"lastname" text,
	"company_id" bigint NOT NULL,
	"address" text,
	"city" text,
	"state" text,
	"zip" text,
	"email" text,
	"phone" text,
	"is_blocked" boolean DEFAULT false NOT NULL,
	"balance" numeric DEFAULT '0' NOT NULL,
	"status_change_date" timestamp with time zone,
	"is_online" boolean DEFAULT false NOT NULL,
	"is_onjob" boolean DEFAULT false NOT NULL,
	"app_user_id" bigint NOT NULL,
	"provider_type" text,
	"rating" numeric DEFAULT '0',
	"firebase_uid" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider_service" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"provider_id" bigint NOT NULL,
	"service_id" bigint NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_area_rate" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"area_id" bigint NOT NULL,
	"area_rate_id" bigint NOT NULL,
	"value" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_area" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"area_name" varchar(256) NOT NULL,
	"area_state" varchar(256) NOT NULL,
	"url_link" varchar(256) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"name" varchar(256) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT false NOT NULL,
	"labor_type_rate_id" integer NOT NULL,
	"rate_value" numeric DEFAULT '0' NOT NULL,
	"disclaimer" text,
	"min_hours" bigint,
	"icon_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_driver" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"vehicle_id" bigint NOT NULL,
	"driver_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"manufacturer_id" bigint NOT NULL,
	"model_id" bigint NOT NULL,
	"company_id" bigint,
	"vehicle_year" integer NOT NULL,
	"vehicle_unit" varchar(256) NOT NULL,
	"vehicle_vin_serial" varchar(256) NOT NULL,
	"vehicle_mileage" numeric,
	"vehicle_usdot" varchar(256),
	"type_id" bigint
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider" ADD CONSTRAINT "provider_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider" ADD CONSTRAINT "provider_app_user_id_app_user_id_fk" FOREIGN KEY ("app_user_id") REFERENCES "app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_area_rate" ADD CONSTRAINT "service_area_rate_area_id_service_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "service_area"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
