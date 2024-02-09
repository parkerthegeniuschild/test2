import {
  bigint,
  bigserial,
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const services = pgTable('service', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description'),
  is_active: boolean('is_active').default(false).notNull(),
  labor_type_rate_id: integer('labor_type_rate_id').notNull(),
  rate_value: numeric('rate_value').notNull().default('0'),
  disclaimer: text('disclaimer'),
  min_hours: bigint('min_hours', { mode: 'number' }),
  icon_id: bigint('icon_id', { mode: 'number' }),
});
