import { createJobEarningsItemAction } from '@core/earnings';
import { camelCaseKeys, snakeCaseKeys } from '@utils/helpers';
import { useAuth, userIsAgent } from 'clients/auth';
import { createJobEarningsItemsSchema } from 'db/schema/jobEarningsItems';
import { jobVehicleContactPostPath } from 'dto/jobVehicleContact/create';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { useJsonBody, usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(async () => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const { username } = useAuth();

  const pathParams = jobVehicleContactPostPath.parse(usePathParams());

  const body = createJobEarningsItemsSchema.parse({
    ...camelCaseKeys(useJsonBody()),
    createdBy: username,
    jobId: pathParams.id,
  });

  const item = await createJobEarningsItemAction(body);

  return snakeCaseKeys(item);
});
