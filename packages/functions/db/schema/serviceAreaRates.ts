import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  numeric,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { serviceAreas } from './serviceAreas';

export const serviceAreaRates = pgTable('service_area_rate', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  area_id: bigint('area_id', { mode: 'number' })
    .references(() => serviceAreas.id)
    .notNull(),
  area_rate_id: bigint('area_rate_id', { mode: 'number' }).notNull(),
  value: numeric('value').notNull().default('0'),
});

export const serviceAreaRateRelations = relations(
  serviceAreaRates,
  ({ one }) => ({
    serviceAreas: one(serviceAreas, {
      fields: [serviceAreaRates.area_id],
      references: [serviceAreas.id],
    }),
  })
);
