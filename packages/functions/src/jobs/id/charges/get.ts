import { getJobPaymentsItemAction } from '@core/charges';
import { snakeCaseKeys } from '@utils/helpers';
import { userIsAgent } from 'clients/auth';
import { jobVehicleContactPostPath } from 'dto/jobVehicleContact/create';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(async () => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const pathParams = jobVehicleContactPostPath.parse(usePathParams());

  const item = await getJobPaymentsItemAction(pathParams.id);

  return snakeCaseKeys(item);
});
