import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  bigint,
  bigserial,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import type { Enum } from '@utils/types';
import { enumFromConst } from '@utils/schema';
import { jobVehicleContacts } from './jobVehicleContacts';
import { providers } from './providers';
import {
  jobVehicleContactServiceParts,
  selectJobVehicleContactServicePartSchemaForPublish,
} from './jobVehicleContactServiceParts';
import { services } from './services';
import { serviceTimers } from './serviceTimers';

export const JobVehicleContactServicesStatus = {
  READY: 'READY',
  STARTED: 'STARTED',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
} as const;
export type JobVehicleContactServicesStatus = Enum<
  typeof JobVehicleContactServicesStatus
>;
export const jobVehicleContactServicesStatusSchema = enumFromConst(
  JobVehicleContactServicesStatus
);

export const jobVehicleContactServices = pgTable(
  'job_vehicle_contact_service',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    created_by: varchar('created_by', { length: 256 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_by: varchar('updated_by', { length: 256 }),
    updated_at: timestamp('updated_at', { withTimezone: true }),
    // This indicates that the service was created by the provider, and they can edit
    provider_id: bigint('provider_id', { mode: 'number' }).references(
      () => providers.id
    ),
    job_vehicle_contact_id: bigint('job_vehicle_contact_id', { mode: 'number' })
      .notNull()
      .references((): AnyPgColumn => jobVehicleContacts.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    service_id: bigint('service_id', { mode: 'number' }).references(
      (): AnyPgColumn => services.id,
      {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }
    ),
    status: varchar('status', {
      length: 256,
      enum: jobVehicleContactServicesStatusSchema.options,
    })
      .notNull()
      .default(JobVehicleContactServicesStatus.READY),
    description: text('description').notNull(),
    rate_cents: integer('rate_cents').notNull().default(0),
    old_id: bigint('old_id', { mode: 'number' }),
  }
);

export const jobVehicleContactServicesRelations = relations(
  jobVehicleContactServices,
  ({ one, many }) => ({
    jobVehicle: one(jobVehicleContacts, {
      fields: [jobVehicleContactServices.job_vehicle_contact_id],
      references: [jobVehicleContacts.id],
    }),
    service: one(services, {
      fields: [jobVehicleContactServices.service_id],
      references: [services.id],
    }),
    jobServiceParts: many(jobVehicleContactServiceParts),
    serviceTimers: many(serviceTimers),
  })
);

export const createJobVehicleContactServiceSchema = createInsertSchema(
  jobVehicleContactServices
).pick({
  service_id: true,
  description: true,
});

export const updateJobVehicleContactServiceSchema = createInsertSchema(
  jobVehicleContactServices,
  {
    description: (schema) => schema.description.optional(),
  }
)
  .pick({
    service_id: true,
    description: true,
    status: true,
  })
  .extend({
    keep_working: z.boolean().optional().default(false),
  });

export const selectJobVehicleContactServiceSchema = createSelectSchema(
  jobVehicleContactServices
);

export type IJobVehicleContactServiceSchema = z.infer<
  typeof selectJobVehicleContactServiceSchema
>;

export const selectJobVehicleContactServiceSchemaForPublish =
  createSelectSchema(jobVehicleContactServices, {
    service_id: (schema) =>
      schema.service_id.transform(String).refine((data) => !!data),
    description: (schema) => schema.description.nonempty(),
  }).extend({
    service: z.object({}),
    parts: z
      .array(selectJobVehicleContactServicePartSchemaForPublish)
      .optional(),
  });

export type IJobVehicleContactServicePublished = z.infer<
  typeof selectJobVehicleContactServiceSchemaForPublish
>;
