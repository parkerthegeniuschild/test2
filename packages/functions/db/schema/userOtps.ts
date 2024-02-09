import { relations } from 'drizzle-orm';
import {
  bigint,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { timestampInt } from '../pgTypes';

export const userOtps = pgTable('userOtp', {
  userId: bigint('id', { mode: 'number' })
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .primaryKey(),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedBy: varchar('updated_by', { length: 256 }),
  updatedAt: timestamp('updated_at'),
  modified: timestampInt('modified').notNull(),
  hash: text('hash').notNull(),
  challengeHash: text('challengeHash').notNull(),
  strikes: integer('strikes').default(0).notNull(),
  lastAttempt: integer('lastAttempt'),
});

export const userOtpsRelations = relations(userOtps, ({ one }) => ({
  users: one(users, {
    fields: [userOtps.userId],
    references: [users.id],
  }),
}));
