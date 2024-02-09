import { updateTimerAction } from '@core/serviceTimers';
import { camelCaseKeys, snakeCaseKeys } from '@utils/helpers';
import { useAuth, userIsAgent } from 'clients/auth';
import { patchServiceTimerSchema } from 'db/schema/serviceTimers';
import { serviceTimerPatchPath } from 'dto/serviceTimers/patch';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { useJsonBody, usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(async () => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const { username } = useAuth();

  const pathParams = serviceTimerPatchPath.parse(usePathParams());
  const body = patchServiceTimerSchema.parse(camelCaseKeys(useJsonBody()));

  const updatedTimer = await updateTimerAction(pathParams, {
    ...body,
    updatedBy: username,
  });

  return snakeCaseKeys(updatedTimer);
});
