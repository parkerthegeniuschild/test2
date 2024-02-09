import { JobComments } from '@core/jobComments';
import { buildUpdatedPropertiesV2, snakeCaseKeys } from '@utils/helpers';
import { useAuth, userIsAgent } from 'clients/auth';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupNotFoundError } from 'src/errors';
import { useJsonBody, usePathParams } from 'sst/node/api';

// agents can update any comment
// providers can update comments that they are the owner of
export const handler = TupApiHandler(async ({ event }) => {
  const { userId } = useAuth();
  const { commentId } = JobComments.updatePathParams.parse(usePathParams());
  const updates = {
    commentId,
    ...JobComments.updateBody.parse(useJsonBody()),
    ...buildUpdatedPropertiesV2(event),
  };

  if (!userIsAgent()) {
    await JobComments.assertCommentOwner({ commentId, userId });
  }

  const res = await JobComments.update(updates);
  if (!res) throw new TruckupNotFoundError();
  return snakeCaseKeys(res);
});
