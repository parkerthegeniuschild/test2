import { getJobEarningsItemAction } from '@core/earnings';
import { snakeCaseKeys } from '@utils/helpers';
import { userIsAgent } from 'clients/auth';
import { jobVehicleContactPostPath } from 'dto/jobVehicleContact/create';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(async () => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const pathParams = jobVehicleContactPostPath.parse(usePathParams());

  const item = await getJobEarningsItemAction(pathParams.id);

  return snakeCaseKeys(item);
});
