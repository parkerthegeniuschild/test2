import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  boolean,
  doublePrecision,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { providers } from './providers';

export const providerLocations = pgTable('provider_location', {
  id: bigserial('id', { mode: 'number' }),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  provider_id: bigint('provider_id', { mode: 'number' }).notNull(),
  speed: doublePrecision('speed').default(0),
  speed_accuracy: doublePrecision('speed_accuracy'),
  vertical_accuracy: numeric('vertical_accuracy'),
  course_accuracy: doublePrecision('course_accuracy'),
  course: doublePrecision('course'),
  longitude: doublePrecision('longitude'),
  latitude: doublePrecision('latitude'),
  accuracy: doublePrecision('accuracy'),
  job_id: bigint('job_id', { mode: 'number' }),
  is_moving: boolean('is_moving'),
  battery_level: doublePrecision('battery_level'),
  battery_is_charging: boolean('battery_is_charging'),
  activity_type: text('activity_type'),
  activity_confidence: smallint('activity_confidence'),
  location_event: text('location_event'),
  location_event_uuid: uuid('location_event_uuid'),
  timestamp: timestamp('timestamp', { withTimezone: true }),
  odometer: doublePrecision('odometer'),
  age: bigint('age', { mode: 'number' }),
  ellipsoidal_altitude: doublePrecision('ellipsoidal_altitude'),
  altitude: doublePrecision('altitude'),
  altitude_accuracy: doublePrecision('altitude_accuracy'),
});

export const providerLocationsRelations = relations(
  providerLocations,
  ({ one }) => ({
    providers: one(providers, {
      fields: [providerLocations.provider_id],
      references: [providers.id],
    }),
  })
);
