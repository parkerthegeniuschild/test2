import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  doublePrecision,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

/* eslint-disable import/no-cycle */
import { z } from 'zod';
import { enumFromConst } from '@utils/schema';
import { JobStatuses } from '@utils/constants';
import { companies } from './companies';
import { dispatchers } from './dispatchers';
import { jobRequests } from './jobRequests';
import { jobVehicles } from './JobVehicles';
import { providers } from './providers';
import { jobLabors } from './jobLabors';
import { comments } from './comments';
import { jobDrivers } from './jobDrivers';
import { jobVehicleContacts } from './jobVehicleContacts';
import { jobLeaveReason } from './jobLeaveReason';
import { dbJobPhotos } from './jobPhotos';
import { serviceTimers } from './serviceTimers';
import { dbTransactionLogs } from './transactionLogs';
/* eslint-enable import/no-cycle */

// NOTE: We shouldn't use enum in the database to avoid errors with it. The migrations do not create this enum properly.
export const jobStatusEnum = pgEnum('job_status', [
  'UNASSIGNED',
  'NOTIFYING',
  'ACCEPTED',
  'MANUAL',
  'PAUSE',
  'IN_PROGRESS',
  'COMPLETED_PENDING_REVIEW',
  'CANCELED_PENDING_REVIEW',
  'COMPLETED',
  'CANCELED',
  'DRAFT',
]);

export const jobs = pgTable(
  'job_table',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
    created_by: varchar('created_by', { length: 256 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_by: varchar('updated_by', { length: 256 }),
    updated_at: timestamp('updated_at', { withTimezone: true }),
    dispatcher_id: bigint('dispatcher_id', { mode: 'number' }),
    service_area_id: bigint('service_area_id', { mode: 'number' }),
    company_id: bigint('company_id', { mode: 'number' }),
    location_address: varchar('location_address', { length: 256 }),
    location_street: text('location_street'),
    location_street_number: text('location_street_number'),
    location_zip: text('location_zip'),
    location_state: varchar('location_state', { length: 256 }),
    location_city: varchar('location_city', { length: 256 }),
    location_details: varchar('location_details', { length: 256 }),
    location_notes: varchar('location_notes', { length: 256 }),
    location_type: varchar('location_type', { length: 256 }),
    location_latitude: doublePrecision('location_latitude'),
    location_longitude: doublePrecision('location_longitude'),
    is_pending_review: boolean('is_pending_review').default(true),
    rating: bigint('rating', { mode: 'number' }),
    status_id: varchar('status_id', {
      length: 256,
      enum: enumFromConst(JobStatuses).options,
    }).default(JobStatuses.DRAFT),
    total_cost: numeric('total_cost').default('0'),
    payment_method: varchar('payment_method', { length: 256 }),
    payment_refnumber: varchar('payment_refnumber', { length: 256 }),
    promised_time: timestamp('promised_time', { withTimezone: true }),
    provider_id: bigint('provider_id', { mode: 'number' }).references(
      () => providers.id
    ),
    payment_sum: numeric('payment_sum').default('0'),
    is_abandoned: boolean('is_abandoned').default(false),
    customer_ref: varchar('customer_ref', { length: 256 }),
    provider_callout_cents: integer('provider_callout_cents')
      .notNull()
      .default(0),
    provider_rate_cents: integer('provider_rate_cents').notNull().default(0),
    charge_callout_cents: integer('charge_callout_cents').notNull(),
    charge_rate_cents: integer('charge_rate_cents').notNull(),
    charge_fuel_surcharge_cents: integer(
      'charge_fuel_surcharge_cents'
    ).notNull(),
    invoice_message: text('invoice_message'),
  },
  (table) => ({
    jobCreatedAtIndex: index('job_created_at').on(table.created_at),
  })
);

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  provider: one(providers, {
    fields: [jobs.provider_id],
    references: [providers.id],
  }),
  company: one(companies, {
    fields: [jobs.company_id],
    references: [companies.id],
  }),
  jobRequest: one(jobRequests, {
    fields: [jobs.id],
    references: [jobRequests.job_id],
  }),
  dispatcher: one(dispatchers, {
    fields: [jobs.dispatcher_id],
    references: [dispatchers.id],
  }),
  jobVehicle: one(jobVehicles, {
    fields: [jobs.id],
    references: [jobVehicles.job_id],
  }),
  jobPhotos: many(dbJobPhotos),
  jobLabor: many(jobLabors),
  comments: many(comments),
  jobDrivers: many(jobDrivers),
  jobVehicles: many(jobVehicleContacts),
  jobLeaveReason: many(jobLeaveReason),
  serviceTimers: many(serviceTimers),
  transactionLogs: many(dbTransactionLogs),
}));

export const createJobSchema = createInsertSchema(jobs, {
  id: (schema) => schema.id.optional(),
  charge_callout_cents: (schema) => schema.charge_callout_cents.optional(),
  charge_fuel_surcharge_cents: (schema) =>
    schema.charge_fuel_surcharge_cents.optional(),
  charge_rate_cents: (schema) => schema.charge_rate_cents.optional(),
});

export const patchJobSchema = createInsertSchema(jobs, {
  status_id: z.enum(['PAUSE', 'IN_PROGRESS', 'COMPLETED_PENDING_REVIEW']),
}).pick({
  dispatcher_id: true,
  company_id: true,
  location_address: true,
  location_street: true,
  location_street_number: true,
  location_zip: true,
  location_state: true,
  location_city: true,
  location_details: true,
  location_notes: true,
  location_type: true,
  location_latitude: true,
  location_longitude: true,
  promised_time: true,
  status_id: true,
  customer_ref: true,
  provider_callout_cents: true,
  provider_rate_cents: true,
  invoice_message: true,
});

export const selectJobSchema = createSelectSchema(jobs);

export type SelectJobSchema = z.infer<typeof selectJobSchema>;

export const selectJobSchemaForProviderValidation = createSelectSchema(
  jobs
).pick({
  provider_id: true,
});

export const selectJobSchemaForPublish = createSelectSchema(jobs, {
  status_id: z.enum(['DRAFT']),
}).merge(
  z.object({
    location_address: z.string().min(1).max(256),
    location_state: z.string().min(1).max(256),
    location_city: z.string().min(1).max(256),
    location_details: z.string().min(1).max(256),
    location_latitude: z.number().max(90).min(-90),
    location_longitude: z.number().max(180).min(-180),
  })
);

export type SelectJobSchemaForProviderValidation = z.infer<
  typeof selectJobSchemaForProviderValidation
>;
