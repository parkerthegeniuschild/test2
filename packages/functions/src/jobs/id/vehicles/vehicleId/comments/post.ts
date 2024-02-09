import { useJsonBody, usePathParams } from 'sst/node/api';
import { JobComments } from '@core/jobComments';
import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import { TruckupForbiddenError } from 'src/errors';
import TupApiHandler from 'handlers/TupApiHandler';
import { snakeCaseKeys } from '@utils/helpers';

export const handler = TupApiHandler(
  async () => {
    const pathParams = JobComments.createPathParams.parse(usePathParams());
    const body = JobComments.createBody.parse(useJsonBody());

    const author = await authenticateAuthor({ jobId: pathParams.jobId });

    const comment = await JobComments.create({
      ...pathParams,
      ...body,
      ...author,
    });

    return snakeCaseKeys(comment);
  },
  { method: 'POST' }
);

const authenticateAuthor = async ({
  jobId,
}: {
  jobId: number;
}): Promise<{ userId: number; createdBy: string; role: JobComments.IRole }> => {
  const { userId, providerId, username: createdBy } = useAuth();
  if (userIsAgent()) return { role: 'AGENT', userId, createdBy };
  if (userIsProvider() && providerId) {
    await JobComments.assertAccessProvider({ providerId, jobId });
    return { role: 'PROVIDER', userId, createdBy };
  }
  throw new TruckupForbiddenError();
};
