import { updateJobEarningsItemAction } from '@core/earnings';
import { camelCaseKeys, snakeCaseKeys } from '@utils/helpers';
import { useAuth, userIsAgent } from 'clients/auth';
import { updateJobEarningsItemsSchema } from 'db/schema/jobEarningsItems';
import { jobEarningsItemPatchPath } from 'dto/earnings/patch';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { useJsonBody, usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(async () => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const { username } = useAuth();

  const { id: jobId, earningsId } = jobEarningsItemPatchPath.parse(
    usePathParams()
  );

  const body = updateJobEarningsItemsSchema.parse({
    ...camelCaseKeys(useJsonBody()),
    jobId,
    id: earningsId,
    updatedBy: username,
  });

  const item = await updateJobEarningsItemAction(body);

  return snakeCaseKeys(item);
});
