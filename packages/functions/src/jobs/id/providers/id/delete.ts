import { db } from '@core/jobs';
import { stopActiveTimer } from '@db/serviceTimers';
import { JobRequestStatus, JobStatuses } from '@utils/constants';
import { buildUpdatedProperties } from '@utils/helpers';
import { PathIdScalar } from '@utils/schema';
import { useAuth, userIsAgent } from 'clients/auth';
import { jobRequests as jobRequestsSchema } from 'db/schema/jobRequests';
import { jobs as jobsSchema } from 'db/schema/jobs';
import { and, eq, inArray, notInArray } from 'drizzle-orm';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError, TruckupNotFoundError } from 'src/errors';
import { z } from 'zod';

const urlPathParameters = z.object({
  id: PathIdScalar,
  providerId: PathIdScalar,
});

export const handler = TupApiHandler(async ({ event }) => {
  const { id: jobId, providerId } = urlPathParameters.parse(
    event.pathParameters
  );
  const updatedProps = buildUpdatedProperties(event);

  const auth = useAuth();
  if (!userIsAgent(auth)) throw new TruckupForbiddenError();

  const lockedStatus = [
    JobStatuses.COMPLETED_PENDING_REVIEW,
    JobStatuses.CANCELED_PENDING_REVIEW,
    JobStatuses.COMPLETED,
    JobStatuses.CANCELED,
  ];

  const isJobId = eq(jobsSchema.id, jobId);
  const isProviderId = eq(jobsSchema.provider_id, providerId);

  await db.transaction(async (tx) => {
    // Changing Job Status to UNASSIGNED
    const jobsUpdated = await tx
      .update(jobsSchema)
      .set({
        provider_id: null,
        status_id: JobStatuses.UNASSIGNED,
        ...updatedProps,
      })
      .where(
        and(
          isJobId,
          isProviderId,
          notInArray(jobsSchema.status_id, lockedStatus)
        )
      )
      .returning();

    if (!jobsUpdated.length) throw new TruckupNotFoundError();

    // Changing JobRequest Status to REMOVED
    await tx
      .update(jobRequestsSchema)
      .set({ status: JobRequestStatus.REMOVED, ...updatedProps })
      .where(
        and(
          eq(jobRequestsSchema.job_id, jobId),
          eq(jobRequestsSchema.provider_id, providerId),
          inArray(jobRequestsSchema.status, [
            JobRequestStatus.ASSIGNED,
            JobRequestStatus.ACCEPTED,
          ])
        )
      );

    // pause any timers. this method does not fail if there are no active timers
    await stopActiveTimer({
      jobId,
      providerId,
      author: auth.username,
      dbInstance: tx,
    });

    // Check if this provider has any jobLabors
    // Sum the earnings of all the labors that have been paid, and debit from the Provider's balance.
    // Remove JobLabors
  });
});
