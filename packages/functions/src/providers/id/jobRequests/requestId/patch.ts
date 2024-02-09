import {
  jobRequests as jobRequestsSchema,
  patchJobRequestsAcceptedDeclinedSchema,
  patchJobRequestsNoResponseSchema,
  patchJobRequestsStatusSchema,
} from 'db/schema/jobRequests';
import { jobs as jobsSchema } from 'db/schema/jobs';
import { useJsonBody, usePathParams } from 'sst/node/api';
import { useDb } from 'db/dbClient';
import { and, eq, inArray, isNull, ne } from 'drizzle-orm';
import {
  IUpdatedProps,
  buildUpdatedProperties,
  updatedPropsSchema,
} from '@utils/helpers';
import { JobRequestStatus, ROLE } from '@utils/constants';
import { z } from 'zod';
import { useAuth } from 'clients/auth';
import {
  TruckupBadRequestError,
  TruckupForbiddenError,
  TruckupInternalServerErrorError,
  TruckupNotFoundError,
} from 'src/errors';
import { getProviderRates } from '@db/providers';
import TupApiHandler from 'handlers/TupApiHandler';
import { PathIdScalar } from '@utils/schema';
import { TTransaction } from '@utils/dbTransaction';

const pathSchema = z.object({
  id: PathIdScalar,
  requestId: PathIdScalar,
});

export const handler = TupApiHandler(async ({ event }) => {
  const { id: providerId, requestId } = pathSchema.parse(usePathParams());

  useAuth({ requiredRole: ROLE.PROVIDER, providerId });

  const updatedProps = buildUpdatedProperties(event);

  const updates = patchJobRequestsStatusSchema.parse({
    ...useJsonBody(),
    ...updatedProps,
  });
  const { status } = updates;

  await useDb().transaction(async (tx) => {
    switch (status) {
      case JobRequestStatus.ACCEPTED:
      case JobRequestStatus.DECLINED: {
        const jobRequest = await getJobRequest(tx, requestId, providerId);
        await acceptOrDeclineJobRequest(tx, requestId, providerId, updates);

        if (status === 'ACCEPTED') {
          await acceptJob(tx, providerId, jobRequest.job_id, updatedProps);
          await updateOtherJobRequestsToLost(
            tx,
            requestId,
            jobRequest.job_id,
            updatedProps
          );
        }
        break;
      }
      case JobRequestStatus.NO_RESPONSE: {
        await noResponseJobRequest(tx, requestId, providerId, updates);
        break;
      }
      default: {
        throw new TruckupInternalServerErrorError();
      }
    }
  });
});

async function getJobRequest(
  tx: TTransaction,
  requestId: number,
  providerId: number
) {
  // Check if job request exists and belongs to the provider
  const jobRequest = await tx
    .select()
    .from(jobRequestsSchema)
    .where(eq(jobRequestsSchema.id, requestId));

  if (!jobRequest?.length) {
    throw new TruckupNotFoundError();
  }

  if (jobRequest[0].provider_id !== providerId) {
    throw new TruckupForbiddenError();
  }

  if (jobRequest[0].status !== 'NOTIFYING') {
    throw new TruckupBadRequestError();
  }

  return jobRequest[0];
}

async function acceptOrDeclineJobRequest(
  tx: TTransaction,
  requestId: number,
  providerId: number,
  updates: z.infer<typeof patchJobRequestsAcceptedDeclinedSchema>
) {
  // Updating job request status to ACCEPTED/DECLINED
  const resultRequestUpdateToNewStatus = await tx
    .update(jobRequestsSchema)
    .set(patchJobRequestsStatusSchema.parse(updates))
    .where(
      and(
        eq(jobRequestsSchema.id, requestId),
        eq(jobRequestsSchema.status, 'NOTIFYING'),
        eq(jobRequestsSchema.provider_id, providerId)
      )
    )
    .returning({
      id: jobRequestsSchema.id,
    });

  // If no other jobRequests were updated, return error
  if (resultRequestUpdateToNewStatus.length === 0) {
    throw new TruckupBadRequestError();
  }
}

async function noResponseJobRequest(
  tx: TTransaction,
  requestId: number,
  providerId: number,
  updates: z.infer<typeof patchJobRequestsNoResponseSchema>
) {
  // request must be at least 10 minutes old (5 seconds of slip allowed)
  const cutoff = new Date(Date.now() - (10 * 60 * 1000 - 5000));
  const [updated = undefined] = await tx
    .update(jobRequestsSchema)
    .set(patchJobRequestsNoResponseSchema.parse(updates))
    .where(
      and(
        eq(jobRequestsSchema.id, requestId),
        eq(jobRequestsSchema.status, JobRequestStatus.NOTIFYING),
        eq(jobRequestsSchema.provider_id, providerId)
      )
    )
    .returning();

  if (updated) {
    if (updated.created_at.valueOf() > cutoff.valueOf())
      throw new TruckupBadRequestError('Cannot update to NO_RESPONSE');
  } else {
    const [existing = undefined] = await tx
      .select()
      .from(jobRequestsSchema)
      .where(
        and(
          eq(jobRequestsSchema.id, requestId),
          eq(jobRequestsSchema.provider_id, providerId)
        )
      );

    if (!existing) throw new TruckupNotFoundError();
    // no_response should allow the race condition
    if (existing.status !== JobRequestStatus.NO_RESPONSE)
      throw new TruckupBadRequestError();
  }
}

async function acceptJob(
  tx: TTransaction,
  providerId: number,
  jobId: number,
  updatedProps: IUpdatedProps
) {
  // update the job from NOTIFYING/UNASSIGNED to ACCEPTED, set the providerId, the provider_callout_cents and provider_rate_cents
  const rates = await getProviderRates({ providerId, dbInstance: tx });
  const resultJobUpdate = await tx
    .update(jobsSchema)
    .set({
      status_id: 'ACCEPTED',
      provider_id: providerId,
      ...updatedPropsSchema.parse(updatedProps),
      provider_callout_cents: rates.callout * 100,
      provider_rate_cents: rates.rate * 100,
    })
    .where(
      and(
        eq(jobsSchema.id, jobId),
        inArray(jobsSchema.status_id, ['NOTIFYING', 'UNASSIGNED']),
        isNull(jobsSchema.provider_id)
      )
    )
    .returning({ id: jobsSchema.id });

  // If no job was updated, return error
  if (resultJobUpdate.length === 0) {
    throw new TruckupBadRequestError();
  }
}

async function updateOtherJobRequestsToLost(
  tx: TTransaction,
  requestId: number,
  jobId: number,
  updatedProps: IUpdatedProps
) {
  // Update any other jobRequests for the same job from NOTIFYING to LOST
  await tx
    .update(jobRequestsSchema)
    .set({ status: 'LOST', ...updatedPropsSchema.parse(updatedProps) })
    .where(
      and(
        ne(jobRequestsSchema.id, requestId),
        eq(jobRequestsSchema.job_id, jobId),
        eq(jobRequestsSchema.status, 'NOTIFYING')
      )
    );
}
