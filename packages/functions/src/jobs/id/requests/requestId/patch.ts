import { PathIdScalar } from '@utils/schema';
import { buildUpdatedProperties } from '@utils/helpers';
import { useDb } from 'db/dbClient';
import { jobRequests } from 'db/schema/jobRequests';
import { and, eq } from 'drizzle-orm';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupNotFoundError } from 'src/errors';
import { useJsonBody, usePathParams } from 'sst/node/api';
import { z } from 'zod';
import { JobRequestStatus } from '@utils/constants';

const PatchRequestBody = z.object({
  status: z.literal(JobRequestStatus.CANCELED),
});
const PatchRequestPathParams = z.object({
  jobId: PathIdScalar,
  requestId: PathIdScalar,
});

export const handler = TupApiHandler(
  async ({ event }) => {
    const { requestId } = PatchRequestPathParams.parse(usePathParams());
    const update = {
      ...PatchRequestBody.parse(useJsonBody()),
      ...buildUpdatedProperties(event),
    };

    const [res] = await useDb({ jobRequests })
      .update(jobRequests)
      .set(update)
      .where(
        and(eq(jobRequests.id, requestId), eq(jobRequests.status, 'NOTIFYING'))
      )
      .returning();
    if (!res) throw new TruckupNotFoundError();
    return res;
  },
  { auth: { requiredRole: 'ROLE_AGENT' } }
);
