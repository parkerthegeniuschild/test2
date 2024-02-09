import { createTimerAction } from '@core/serviceTimers';
import { camelCaseKeys, snakeCaseKeys } from '@utils/helpers';
import { useAuth, userIsAgent } from 'clients/auth';
import { postServiceTimerSchema } from 'db/schema/serviceTimers';
import { jobVehicleContactPostPath } from 'dto/jobVehicleContact/create';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { useJsonBody, usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(async () => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const { username } = useAuth();

  const pathParams = jobVehicleContactPostPath.parse(usePathParams());
  const body = postServiceTimerSchema.parse({
    ...camelCaseKeys({ ...useJsonBody(), jobId: pathParams.id }),
    createdBy: username,
    jobId: pathParams.id,
  });

  const createdTimer = await createTimerAction(body);

  return snakeCaseKeys(createdTimer);
});
