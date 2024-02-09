import { deleteJobPaymentsItemAction } from '@core/charges';
import { userIsAgent } from 'clients/auth';
import { jobPaymentsItemPatchPath } from 'dto/charges/patch';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(async () => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const pathParams = jobPaymentsItemPatchPath.parse(usePathParams());

  await deleteJobPaymentsItemAction(pathParams);
});
