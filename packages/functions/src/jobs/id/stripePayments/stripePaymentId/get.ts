import { getPaymentByStripeId } from '@core/charges';
import { ROLE } from '@utils/constants';
import { useAuth } from 'clients/auth';
import TupApiHandler from 'handlers/TupApiHandler';
import { usePathParams } from 'sst/node/api';
import { snakeCaseKeys } from '@utils/helpers';
import { TruckupNotFoundError } from 'src/errors';
import { PathParamsSchema } from './open-api';

export const handler = TupApiHandler(async () => {
  useAuth({ requiredRole: ROLE.AGENT });
  const { id: jobId, stripePaymentId } = PathParamsSchema.parse(
    usePathParams()
  );

  const payment = await getPaymentByStripeId({ jobId, stripePaymentId });
  if (!payment) throw new TruckupNotFoundError();

  return snakeCaseKeys(payment);
});
