import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  bigint,
  bigserial,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

/* eslint-disable import/no-cycle */
import { jobs } from './jobs';
/* eslint-enable import/no-cycle */

/** @deprecated */
export const comments = pgTable(
  'job_comment',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    created_by: varchar('created_by', { length: 256 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_by: varchar('updated_by', { length: 256 }),
    updated_at: timestamp('updated_at', { withTimezone: true }),
    job_id: bigint('job_id', { mode: 'number' })
      .notNull()
      .references((): AnyPgColumn => jobs.id, { onUpdate: 'cascade' }),
    comment: text('comment').notNull(),
    order_num: integer('order_num').notNull().default(0),
  },
  (table) => ({
    idx_job_comment_job_id: index('idx_job_comment_job_id').on(table.job_id),
  })
);

export const commentsRelations = relations(comments, ({ one }) => ({
  job: one(jobs, { fields: [comments.job_id], references: [jobs.id] }),
}));

export const createCommentSchema = createInsertSchema(comments);
