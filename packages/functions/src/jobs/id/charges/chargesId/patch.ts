import { updateJobPaymentsItemAction } from '@core/charges';
import { camelCaseKeys, snakeCaseKeys } from '@utils/helpers';
import { useAuth, userIsAgent } from 'clients/auth';
import { updateJobPaymentsItemsSchema } from 'db/schema/jobPaymentsItems';
import { jobPaymentsItemPatchPath } from 'dto/charges/patch';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError } from 'src/errors';
import { useJsonBody, usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(async () => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const { username } = useAuth();

  const { id: jobId, chargesId } = jobPaymentsItemPatchPath.parse(
    usePathParams()
  );

  const body = updateJobPaymentsItemsSchema.parse({
    ...camelCaseKeys(useJsonBody()),
    jobId,
    id: chargesId,
    updatedBy: username,
  });

  const item = await updateJobPaymentsItemAction(body);

  return snakeCaseKeys(item);
});
