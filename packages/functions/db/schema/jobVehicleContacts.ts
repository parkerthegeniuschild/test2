import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  bigint,
  bigserial,
  index,
  numeric,
  pgTable,
  smallint,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { enumFromConst } from '@utils/schema';
import { ROLE, VehicleType } from '@utils/constants';
import { jobs } from './jobs';
import { jobVehicleContactServices } from './jobVehicleContactServices';
import { dbJobPhotos } from './jobPhotos';
import { dbJobComments } from './jobComments';
import { appUsers } from './appUsers';

export const jobVehicleContacts = pgTable(
  'job_vehicle_contact',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    created_by: varchar('created_by', { length: 256 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_by: varchar('updated_by', { length: 256 }),
    updated_at: timestamp('updated_at', { withTimezone: true }),
    job_id: bigint('job_id', { mode: 'number' })
      .notNull()
      .references((): AnyPgColumn => jobs.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    // the user that created this
    created_by_id: bigint('created_by_id', { mode: 'number' })
      .notNull()
      .references(() => appUsers.id),
    created_by_role: varchar('created_by_role', {
      enum: enumFromConst(ROLE).options,
    }).notNull(),
    type: varchar('type', {
      length: 256,
      enum: enumFromConst(VehicleType).options,
    }),
    year: smallint('year'),
    unit: varchar('unit', { length: 256 }),
    model: varchar('model', { length: 256 }),
    color: varchar('color', { length: 256 }),
    vin_serial: varchar('vin_serial', { length: 256 }),
    usdot: varchar('usdot', { length: 256 }),
    mileage: numeric('mileage'),
    manufacturer: varchar('manufacturer', { length: 256 }),
    old_id: bigint('old_id', { mode: 'number' }),
  },
  (table) => {
    return {
      idx_job_vehicle_contact_manufacturer: index(
        'idx_job_vehicle_contact_manufacturer'
      ).on(table.manufacturer),
    };
  }
);

export const jobVehicleContactsRelations = relations(
  jobVehicleContacts,
  ({ one, many }) => ({
    job: one(jobs, {
      fields: [jobVehicleContacts.job_id],
      references: [jobs.id],
    }),
    jobServices: many(jobVehicleContactServices),
    jobPhotos: many(dbJobPhotos),
    jobComments: many(dbJobComments),
    user: one(appUsers, {
      fields: [jobVehicleContacts.created_by_id],
      references: [appUsers.id],
    }),
  })
);

export const createJobVehicleContactSchema = createInsertSchema(
  jobVehicleContacts,
  {
    year: z.number(),
    mileage: z.number().optional(),
  }
);

export const updateJobVehicleContactSchema = createInsertSchema(
  jobVehicleContacts,
  {
    type: (schema) => schema.type.optional(),
    year: z.number(),
    mileage: z.number().optional(),
  }
).pick({
  type: true,
  year: true,
  unit: true,
  model: true,
  color: true,
  vin_serial: true,
  usdot: true,
  mileage: true,
  manufacturer: true,
});

export const selectJobVehicleContactSchema =
  createSelectSchema(jobVehicleContacts);

export const selectJobVehicleContactSchemaForPublish = createSelectSchema(
  jobVehicleContacts,
  {
    type: (schema) => schema.type,
    mileage: z.number().optional(),
  }
);
