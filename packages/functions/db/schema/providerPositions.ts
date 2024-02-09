import { relations } from 'drizzle-orm';
import { bigint, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { geospatialPoint } from 'db/pgTypes';
import { providers } from './providers';
import { providerLocations } from './providerLocations';

export const providerPositions = pgTable('provider_position', {
  id: bigint('id', { mode: 'number' })
    .primaryKey()
    .references(() => providers.id),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  provider_location_id: bigint('provider_location_id', {
    mode: 'number',
  })
    .references(() => providerLocations.id)
    .notNull(),
  position: geospatialPoint('position').notNull(),
});

export const providerPositionsRelations = relations(
  providerPositions,
  ({ one }) => ({
    provider: one(providers, {
      fields: [providerPositions.id],
      references: [providers.id],
    }),
    location: one(providerLocations, {
      fields: [providerPositions.provider_location_id],
      references: [providerLocations.id],
    }),
  })
);
