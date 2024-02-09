import {
  bigserial,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const appUsers = pgTable('app_user', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  username: text('username'),
  password: text('password'),
  email: text('email'),
  phone: text('phone'),
  last_login_at: timestamp('last_login_at', { withTimezone: true }),
  app_role: text('app_role'),
});
