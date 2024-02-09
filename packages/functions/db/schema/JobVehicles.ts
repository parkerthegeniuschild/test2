import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

/* eslint-disable import/no-cycle */
import { jobs } from './jobs';
import { vehicles } from './vehicles';
import { jobVehicleServices } from './JobVehicleServices';
/* eslint-enable import/no-cycle */

export const jobVehicles = pgTable('job_vehicle', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  job_id: bigint('job_id', { mode: 'number' }).notNull(),
  vehicle_id: bigint('vehicle_id', { mode: 'number' }).notNull(),
  vehicle_issue: text('vehicle_issue'),
});

export const jobVehiclesRelations = relations(jobVehicles, ({ one, many }) => ({
  job: one(jobs, {
    fields: [jobVehicles.job_id],
    references: [jobs.id],
  }),
  vehicle: one(vehicles, {
    fields: [jobVehicles.vehicle_id],
    references: [vehicles.id],
  }),
  jobVehicleServices: many(jobVehicleServices),
}));

export const createJobVehicleSchema = createInsertSchema(jobVehicles);
