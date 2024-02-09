import assert from 'node:assert/strict';
import { db, getJobById } from '@core/jobs';
import { ApiHandler } from 'sst/node/api';
import { buildBy, buildUpdatedProperties } from '@utils/helpers';
import { response } from '@utils/response';
import { TruckupForbiddenError, TruckupNotFoundError } from 'src/errors';
import { jobs as jobsSchema } from 'db/schema/jobs';
import { and, eq } from 'drizzle-orm';
import {
  createJobLeaveReasonSchema,
  jobLeaveReason,
} from 'db/schema/jobLeaveReason';
import { userIsAgent } from 'clients/auth';

export const handler = ApiHandler(async (_evt) => {
  try {
    if (!userIsAgent()) throw new TruckupForbiddenError();

    assert.ok(_evt.body, 'Missing payload');

    const id = _evt.pathParameters?.id ?? null;

    const job = await getJobById(Number(id));

    if (!job) {
      return response.notFound();
    }

    const { updated_by, updated_at } = buildUpdatedProperties(_evt);
    const created_by = buildBy(_evt);
    const body = JSON.parse(_evt.body); // middy body parser

    const updates = createJobLeaveReasonSchema.parse({
      ...body,
      created_by,
      job_id: job.id,
    });

    await db.transaction(async (tx) => {
      const updated = await tx
        .update(jobsSchema)
        .set({ is_abandoned: true, updated_at, updated_by })
        .where(
          and(
            eq(jobsSchema.id, Number(job.id)),
            eq(jobsSchema.status_id, 'DRAFT')
          )
        )
        .returning();

      if (!updated.length) {
        await tx.rollback();
        throw new TruckupNotFoundError();
      }

      await tx.insert(jobLeaveReason).values({ ...updates });
    });

    return response.success();
  } catch (error) {
    switch (true) {
      case error instanceof TruckupForbiddenError:
        return response.forbidden();
      case error instanceof TruckupNotFoundError:
        return response.notFound();
      default:
        return response.failure(error);
    }
  }
});
