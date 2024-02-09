import { relations, sql } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { users } from './users';

export const stripeAccounts = pgTable(
  'stripe_account',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    createdBy: varchar('created_by', { length: 256 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedBy: varchar('updated_by', { length: 256 }),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    userId: bigint('app_user_id', { mode: 'number' })
      .notNull()
      .references(() => users.id),
    stripeId: varchar('account_num').notNull(),
  },
  (table) => ({
    stripeIndex: uniqueIndex('stripe_account_uk')
      .on(table.userId, table.stripeId)
      .using(sql`btree(${table.userId}, ${table.stripeId})`),
    // drizzle-kit does not support "using" yet, we have to manually add to the migration :)
  })
);

export const selectStripeAccountSchema = createSelectSchema(stripeAccounts);

export const stripeAccountsRelations = relations(stripeAccounts, ({ one }) => ({
  users: one(users, {
    fields: [stripeAccounts.userId],
    references: [users.id],
  }),
}));
