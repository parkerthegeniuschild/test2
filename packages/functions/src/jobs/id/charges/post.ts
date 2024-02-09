import { createJobPaymentsItemAction } from '@core/charges';
import { camelCaseKeys, snakeCaseKeys } from '@utils/helpers';
import { useAuth, userIsAgent } from 'clients/auth';
import {
  JobPaymentsItemPaymentMethod,
  createJobPaymentsItemsSchema,
} from 'db/schema/jobPaymentsItems';
import { jobVehicleContactPostPath } from 'dto/jobVehicleContact/create';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupBadRequestError, TruckupForbiddenError } from 'src/errors';
import { useJsonBody, usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(async () => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const { username } = useAuth();

  const pathParams = jobVehicleContactPostPath.parse(usePathParams());

  const body = createJobPaymentsItemsSchema.parse({
    ...camelCaseKeys(useJsonBody()),
    createdBy: username,
    jobId: pathParams.id,
  });

  if (body.paymentMethod === JobPaymentsItemPaymentMethod.CREDIT_CARD)
    throw new TruckupBadRequestError();

  const item = await createJobPaymentsItemAction(body);

  return snakeCaseKeys(item);
});
