import { relations } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  doublePrecision,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { serviceAreaRates } from './serviceAreaRates';

export const serviceAreas = pgTable('service_area', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  area_name: varchar('area_name', { length: 256 }).notNull(),
  area_state: varchar('area_state', { length: 256 }).notNull(),
  url_link: varchar('url_link', { length: 256 }).notNull(),
  is_active: boolean('is_active').default(false).notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
});

export const serviceAreasRelations = relations(serviceAreas, ({ many }) => ({
  serviceAreasRates: many(serviceAreaRates),
}));
