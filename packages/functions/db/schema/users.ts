import { relations } from 'drizzle-orm';
import {
  bigserial,
  pgTable,
  text,
  timestamp,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { drivers } from './drivers';
import { stripeAccounts } from './stripeAccounts';
import { providers } from './providers';
import { dbJobPhotos } from './jobPhotos';

export const users = pgTable(
  'app_user',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    created_by: varchar('created_by', { length: 256 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_by: varchar('updated_by', { length: 256 }),
    updated_at: timestamp('updated_at', { withTimezone: true }),
    username: text('username').notNull(),
    password: text('password'),
    email: text('email'),
    phone: text('phone'),
    last_login_at: timestamp('last_login_at', { withTimezone: true }),
    app_role: text('app_role').notNull(),
    fcm_token: text('fcm_token'),
  },
  (table) => ({
    emailIndex: uniqueIndex('user_email_unique').on(table.email),
    phoneIndex: uniqueIndex('user_phone_unique').on(table.phone),
  })
);

export const createUserSchema = createInsertSchema(users);

export const selectUserSchema = createSelectSchema(users);

export const usersRelations = relations(users, ({ one, many }) => ({
  drivers: many(drivers),
  provider: one(providers, {
    fields: [users.id],
    references: [providers.app_user_id],
  }),
  stripeAccount: one(stripeAccounts, {
    fields: [users.id],
    references: [stripeAccounts.userId],
  }),
  jobPhotos: many(dbJobPhotos),
}));
