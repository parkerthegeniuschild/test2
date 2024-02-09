import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  integer,
  numeric,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { createInsertSchema } from 'drizzle-zod';
import { jobVehicles } from './JobVehicles';
import { vehicleDrivers } from './vehicleDrivers';

export const vehicles = pgTable('vehicle', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  manufacturer_id: bigint('manufacturer_id', { mode: 'number' }).notNull(),
  model_id: bigint('model_id', { mode: 'number' }).notNull(),
  company_id: bigint('company_id', { mode: 'number' }),
  vehicle_year: integer('vehicle_year').notNull(),
  vehicle_unit: varchar('vehicle_unit', { length: 256 }).notNull(),
  vehicle_vin_serial: varchar('vehicle_vin_serial', { length: 256 }).notNull(),
  vehicle_mileage: numeric('vehicle_mileage'),
  vehicle_usdot: varchar('vehicle_usdot', { length: 256 }),
  type_id: bigint('type_id', { mode: 'number' }),
});

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  vehicleDriver: one(vehicleDrivers, {
    fields: [vehicles.id],
    references: [vehicleDrivers.vehicle_id],
  }),
  JobVehicle: one(jobVehicles, {
    fields: [vehicles.id],
    references: [jobVehicles.vehicle_id],
  }),
}));

export const createVehicleSchema = createInsertSchema(vehicles);
