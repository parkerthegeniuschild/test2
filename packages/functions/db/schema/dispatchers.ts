import { relations } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  pgTable,
  timestamp,
  varchar,
  bigint,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import { companies } from './companies';
import { jobs } from './jobs';

export const dispatchers = pgTable('dispatcher', {
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
  secondary_phone: varchar('secondary_phone', { length: 256 }),
  email: varchar('email', { length: 256 }),
  company_id: bigint('company_id', { mode: 'number' }),
  type_id: bigint('type_id', { mode: 'number' }).notNull(),
});

export const dispatchersRelations = relations(dispatchers, ({ many, one }) => ({
  jobs: many(jobs),
  company: one(companies, {
    fields: [dispatchers.company_id],
    references: [companies.id],
  }),
}));

export const createDispatcherSchema = createInsertSchema(dispatchers);

export const patchDispatcherSchema = createInsertSchema(dispatchers, {
  firstname: (schema) => schema.firstname.optional(),
  phone: (schema) => schema.phone.optional(),
}).pick({
  firstname: true,
  lastname: true,
  phone: true,
  secondary_phone: true,
  email: true,
});
