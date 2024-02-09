import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  bigint,
  bigserial,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

/* eslint-disable import/no-cycle */
import { jobVehicles } from './JobVehicles';
import { services } from './services';
import { photos } from './photos';
/* eslint-enable import/no-cycle */

export const jobVehicleServices = pgTable(
  'job_vehicle_service',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    created_by: varchar('created_by', { length: 256 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_by: varchar('updated_by', { length: 256 }),
    updated_at: timestamp('updated_at', { withTimezone: true }),
    job_vehicle_id: bigint('job_vehicle_id', { mode: 'number' })
      .notNull()
      .references((): AnyPgColumn => jobVehicles.id),
    service_id: bigint('service_id', { mode: 'number' })
      .notNull()
      .references((): AnyPgColumn => services.id),
    status_id: bigint('status_id', { mode: 'number' }),
    cost: numeric('cost').default('0').notNull(),
  },
  (table) => ({
    job_vehicle_service_uk: uniqueIndex('job_vehicle_service_uk').on(
      table.job_vehicle_id,
      table.service_id
    ),
  })
);

export const jobVehicleServicesRelations = relations(
  jobVehicleServices,
  ({ one, many }) => ({
    jobVehicle: one(jobVehicles, {
      fields: [jobVehicleServices.job_vehicle_id],
      references: [jobVehicles.id],
    }),
    service: one(services, {
      fields: [jobVehicleServices.service_id],
      references: [services.id],
    }),
    photos: many(photos),
  })
);

export const createJobVehicleSchema = createInsertSchema(jobVehicleServices);
