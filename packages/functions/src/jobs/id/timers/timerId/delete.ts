import { deleteTimerAction } from '@core/serviceTimers';
import { userIsAgent } from 'clients/auth';
import { serviceTimerPatchPath } from 'dto/serviceTimers/patch';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(async () => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const pathParams = serviceTimerPatchPath.parse(usePathParams());

  await deleteTimerAction(pathParams);
});
