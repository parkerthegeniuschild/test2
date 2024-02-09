import { TruckupNotFoundError } from 'src/errors';

import { getOnlyJobById } from '@core/jobs';
import { changeJobStatusAction } from '@core/jobsStatus';
import TupApiHandler from 'handlers/TupApiHandler';
import { PathIdScalar, enumFromConst } from '@utils/schema';
import { z } from 'zod';
import { JobStatuses } from '@utils/constants';
import { useAuth } from 'clients/auth';
import { useJsonBody } from 'sst/node/api';

const pathParams = z.object({
  id: PathIdScalar,
});

const bodyInput = z.object({
  status_id: enumFromConst(JobStatuses),
});

export const handler = TupApiHandler(async ({ event }) => {
  const { id: jobId } = pathParams.parse(event.pathParameters);
  const { status_id: statusId } = bodyInput.parse(useJsonBody());

  const { username } = useAuth();

  const job = await getOnlyJobById(jobId);

  if (!job) {
    throw new TruckupNotFoundError();
  }

  return await changeJobStatusAction({
    job,
    newStatus: statusId,
    author: username,
  });
});
