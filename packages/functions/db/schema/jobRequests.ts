import { relations, InferModel } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  doublePrecision,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';

import { createInsertSchema } from 'drizzle-zod';
import { enumFromConst } from '@utils/schema';
import { JobRequestStatus } from '@utils/constants';
import { jobs } from './jobs';
import { providers } from './providers';

export const jobRequests = pgTable('request', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  dispatcher_id: bigint('dispatcher_id', { mode: 'number' }),
  provider_id: bigint('provider_id', { mode: 'number' }).notNull(),
  service_area_id: bigint('service_area_id', { mode: 'number' }).notNull(),
  location_address: varchar('location_address', { length: 256 }).notNull(),
  location_state: varchar('location_state', { length: 256 }).notNull(),
  location_city: varchar('location_city', { length: 256 }).notNull(),
  location_details: varchar('location_details', { length: 256 }).notNull(),
  location_notes: varchar('location_notes', { length: 256 }),
  location_latitude: doublePrecision('location_latitude').notNull(),
  location_longitude: doublePrecision('location_longitude').notNull(),
  response_time: timestamp('response_time', { withTimezone: true }),
  job_id: bigint('job_id', { mode: 'number' }).notNull(),
  status: varchar('status', {
    length: 256,
    enum: enumFromConst(JobRequestStatus).options,
  }).notNull(),
  distance: doublePrecision('distance'),
  duration: doublePrecision('duration'),
});

export type JobRequest = InferModel<typeof jobRequests>;

export type NewJobRequest = InferModel<typeof jobRequests, 'insert'>;

export const jobRequestsRelations = relations(jobRequests, ({ one }) => ({
  providers: one(providers, {
    fields: [jobRequests.provider_id],
    references: [providers.id],
  }),
  job: one(jobs, {
    fields: [jobRequests.job_id],
    references: [jobs.id],
  }),
}));

export const calcAcceptedRate = (
  jobRequestsArray: Array<Pick<JobRequest, 'id' | 'provider_id' | 'status'>>
) => {
  return (
    jobRequestsArray.filter(
      (jobRequest) => jobRequest.status === JobRequestStatus.ACCEPTED
    ).length / jobRequestsArray.length
  );
};

export const createJobRequestSchema = createInsertSchema(jobRequests);

export const patchJobRequestsAcceptedDeclinedSchema = createInsertSchema(
  jobRequests,
  {
    updated_at: z.any(),
    status: z.enum([JobRequestStatus.ACCEPTED, JobRequestStatus.DECLINED]),
  }
).pick({
  status: true,
  updated_by: true,
  updated_at: true,
});

export const patchJobRequestsNoResponseSchema =
  patchJobRequestsAcceptedDeclinedSchema.extend({
    status: z.enum([JobRequestStatus.NO_RESPONSE]),
  });

export const patchJobRequestsStatusSchema = z.union([
  patchJobRequestsAcceptedDeclinedSchema,
  patchJobRequestsNoResponseSchema,
]);
