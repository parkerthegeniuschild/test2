import { deleteJobEarningsItemAction } from '@core/earnings';
import { userIsAgent } from 'clients/auth';
import { jobEarningsItemPatchPath } from 'dto/earnings/patch';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(async () => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const pathParams = jobEarningsItemPatchPath.parse(usePathParams());

  await deleteJobEarningsItemAction(pathParams);
});
