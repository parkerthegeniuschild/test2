import { ROLE } from '@utils/constants';
import { useAuth } from 'clients/auth';
import stripe from 'clients/stripe';
import TupApiHandler from 'handlers/TupApiHandler';
import { useJsonBody, usePathParams } from 'sst/node/api';
import { camelCaseKeys, snakeCaseKeys } from '@utils/helpers';
import {
  CreatePaymentIntentPathParamsSchema,
  CreatePaymentIntentRequestSchema,
} from './open-api';

export const handler = TupApiHandler(async () => {
  const { userId } = useAuth({ requiredRole: ROLE.AGENT });

  const { id: jobId } = CreatePaymentIntentPathParamsSchema.parse(
    usePathParams()
  );
  const { amountCents, overpay } = camelCaseKeys(
    CreatePaymentIntentRequestSchema.parse(useJsonBody())
  );

  await validatePayment({ jobId, amountCents, overpay });

  const { clientSecret } = await stripe.createPaymentIntent({
    amount: amountCents,
    metadata: { jobId, agentUserId: userId, overpay: `${overpay}` },
  });

  return snakeCaseKeys({ jobId, amountCents, overpay, clientSecret });
});

interface TValidatePaymentParams {
  jobId: number;
  amountCents: number;
  overpay?: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validatePayment = async (params: TValidatePaymentParams) => {
  // here we can do logic to assert that the payment amount is <= to the job cost, or require the overpay flag
};
