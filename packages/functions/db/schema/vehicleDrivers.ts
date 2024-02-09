import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import { drivers } from './drivers';
import { vehicles } from './vehicles';

export const vehicleDrivers = pgTable('vehicle_driver', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  vehicle_id: bigint('vehicle_id', { mode: 'number' }).notNull(),
  driver_id: bigint('driver_id', { mode: 'number' }).notNull(),
});

export const vehicleDriversRelations = relations(vehicleDrivers, ({ one }) => ({
  driver: one(drivers, {
    fields: [vehicleDrivers.driver_id],
    references: [drivers.id],
  }),
  vehicle: one(vehicles, {
    fields: [vehicleDrivers.vehicle_id],
    references: [vehicles.id],
  }),
}));

export const createVehicleDriverSchema = createInsertSchema(vehicleDrivers);
