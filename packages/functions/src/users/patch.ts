import { AppUser } from '@core/appUser';
import { buildUpdatedProperties, snakeCaseKeys } from '@utils/helpers';
import { useAuth } from 'clients/auth';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupUnauthorizedError } from 'src/errors';
import { useJsonBody, usePathParams } from 'sst/node/api';

// only user can update themselves at the moment
export const handler = TupApiHandler(async ({ event }) => {
  const { userId } = useAuth();
  const path = AppUser.pathParams.parse(usePathParams());
  if (path.userId !== userId) throw new TruckupUnauthorizedError();

  const updates = AppUser.updateSchema.parse({
    ...useJsonBody(),
    ...buildUpdatedProperties(event),
    id: userId,
  });

  const res = await AppUser.update(updates);
  return snakeCaseKeys(res);
});
