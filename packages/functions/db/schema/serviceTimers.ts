import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { jobVehicleContactServices } from './jobVehicleContactServices';
import { providers } from './providers';
import { jobs } from './jobs';

export const serviceTimers = pgTable('service_timer', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedBy: varchar('updated_by', { length: 256 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  jobId: bigint('job_id', { mode: 'number' })
    .notNull()
    .references(() => jobs.id),
  jobVehicleContactServiceId: bigint('job_vehicle_contact_service_id', {
    mode: 'number',
  }).references(() => jobVehicleContactServices.id, {
    onUpdate: 'cascade',
    onDelete: 'cascade',
  }),
  providerId: bigint('provider_id', { mode: 'number' })
    .notNull()
    .references(() => providers.id),
  startTime: timestamp('start_time', { withTimezone: true })
    .defaultNow()
    .notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  oldId: bigint('old_id', { mode: 'number' }),
});

export const serviceTimersRelations = relations(serviceTimers, ({ one }) => ({
  job: one(jobs, {
    fields: [serviceTimers.jobId],
    references: [jobs.id],
  }),
  jobVehicleService: one(jobVehicleContactServices, {
    fields: [serviceTimers.jobVehicleContactServiceId],
    references: [jobVehicleContactServices.id],
  }),
  providers: one(providers, {
    fields: [serviceTimers.providerId],
    references: [providers.id],
  }),
}));

export const createServiceTimerSchema = createInsertSchema(serviceTimers).pick({
  jobId: true,
  jobVehicleContactServiceId: true,
  providerId: true,
  createdBy: true,
});

export const postServiceTimerSchema = createInsertSchema(serviceTimers, {
  startTime: z
    .string()
    .datetime()
    .transform((arg) => new Date(arg)),
  endTime: z
    .string()
    .datetime()
    .transform((arg) => new Date(arg))
    .optional(),
}).pick({
  jobId: true,
  jobVehicleContactServiceId: true,
  providerId: true,
  startTime: true,
  endTime: true,
  createdBy: true,
});

export type IPostServiceTimerSchema = z.infer<typeof postServiceTimerSchema>;

export const patchServiceTimerSchema = createInsertSchema(serviceTimers, {
  startTime: z
    .string()
    .datetime()
    .transform((arg) => new Date(arg))
    .optional(),
  endTime: z
    .string()
    .datetime()
    .transform((arg) => new Date(arg))
    .optional(),
}).pick({
  updatedBy: true,
  updatedAt: true,
  startTime: true,
  endTime: true,
});

export type IPatchServiceTimerSchema = z.infer<typeof patchServiceTimerSchema>;

export const selectServiceTimerSchema = createSelectSchema(serviceTimers);

export type IServiceTimer = z.infer<typeof selectServiceTimerSchema>;
