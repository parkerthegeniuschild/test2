import { usePathParams } from 'sst/node/api';
import { JobComments } from '@core/jobComments';
import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import { TruckupForbiddenError } from 'src/errors';
import { snakeCaseKeys, transformEvent } from '@utils/helpers';
import { dbJobComments } from 'db/schema/jobComments';
import TupApiHandler from 'handlers/TupApiHandler';

export const handler = TupApiHandler(async ({ event }) => {
  const { paginate } = transformEvent(event, dbJobComments);
  const { jobId, vehicleId } = JobComments.listPathParams.parse(
    usePathParams()
  );

  await authenticate({ jobId });

  const [jobComments, total] = await JobComments.list({ jobId, vehicleId });

  return paginate(jobComments.map(snakeCaseKeys), total);
});

const authenticate = async ({ jobId }: { jobId: number }) => {
  const { providerId } = useAuth();
  if (userIsAgent()) return true;
  if (userIsProvider() && providerId) {
    await JobComments.assertAccessProvider({ providerId, jobId });
    return true;
  }
  throw new TruckupForbiddenError();
};
