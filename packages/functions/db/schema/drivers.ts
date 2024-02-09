import { relations } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import { companies } from './companies';
import { jobs } from './jobs';
import { users } from './users';

export const drivers = pgTable('driver', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  firstname: varchar('firstname', { length: 256 }).notNull(),
  lastname: varchar('lastname', { length: 256 }),
  is_no_text_messages: boolean('is_no_text_messages').default(false).notNull(),
  phone: varchar('phone', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }),
  company_id: bigserial('company_id', { mode: 'number' }),
  app_user_id: bigserial('app_user_id', { mode: 'number' }),
});

export const driversRelations = relations(drivers, ({ many, one }) => ({
  jobs: many(jobs),
  company: one(companies, {
    fields: [drivers.company_id],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [drivers.app_user_id],
    references: [users.id],
  }),
}));

export const createDriverSchema = createInsertSchema(drivers);
