import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import {
  IdScalar,
  MomentExample,
  MomentShape,
  PathIdScalar,
  PositiveIntScalar,
} from '@utils/schema';
import { TOpenAPIAction } from '@openAPI/types';
import { jobPaymentsItemPaymentMethodSchema } from 'db/schema/jobPaymentsItems';

export const PathParamsSchema = z
  .object({
    id: PathIdScalar,
    stripePaymentId: z.string().nonempty(),
  })
  .openapi({
    example: {
      id: 4555,
      stripePaymentId: 'pi_3MtwBwLkdIwHu7ix28a3tqPa',
    },
  });

const GetPaymentByStripePaymentIdResponseSchema = z
  .object({
    ...MomentShape,
    job_id: IdScalar,
    stripe_payment_id: z.string(),
    amount_cents: PositiveIntScalar,
    payment_method: jobPaymentsItemPaymentMethodSchema,
    identifier: z.string().nonempty(),
    provider_id: IdScalar.nullable(),
  })
  .openapi({
    example: {
      ...MomentExample,
      job_id: 4555,
      stripe_payment_id: 'pi_3MtwBwLkdIwHu7ix28a3tqPa',
      amount_cents: 900000,
      payment_method: 'credit_card',
      identifier: '1337',
      provider_id: null,
    },
  });

export type TGetPaymentByStripePaymentIdResponseSchema = z.infer<
  typeof GetPaymentByStripePaymentIdResponseSchema
>;

export const GetPaymentByStripePaymentIdAction: TOpenAPIAction = {
  title: 'GetPaymentByStripePaymentIdSchema',
  method: Method.GET,
  path: '/jobs/{id}/stripe-payments/{stripePaymentId}',
  description: 'Look up a job payment by the stripe payment id',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
  },
  response: {
    content: GetPaymentByStripePaymentIdResponseSchema,
  },
};
