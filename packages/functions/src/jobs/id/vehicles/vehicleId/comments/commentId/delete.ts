import { JobComments } from '@core/jobComments';
import TupApiHandler from 'handlers/TupApiHandler';
import { usePathParams } from 'sst/node/api';

// right now, this is restricted to agents only
export const handler = TupApiHandler(
  async () => {
    const { commentId } = JobComments.deletePathParams.parse(usePathParams());

    await JobComments.del({ commentId });
  },
  { auth: { requiredRole: 'ROLE_AGENT' } }
);
