import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import { IdScalar, PathIdScalar, PositiveIntScalar } from '@utils/schema';
import { TOpenAPIAction } from '@openAPI/types';

export const CreatePaymentIntentPathParamsSchema = z
  .strictObject({
    id: PathIdScalar,
  })
  .openapi({
    example: {
      id: 4555,
    },
  });

export const CreatePaymentIntentRequestSchema = z
  .strictObject({
    amount_cents: PositiveIntScalar,
    overpay: z.boolean().optional().default(false),
  })
  .openapi({
    example: {
      amount_cents: 9000,
      overpay: false,
    },
  });
export type TCreatePaymentIntentRequest = z.input<
  typeof CreatePaymentIntentRequestSchema
>;

export const CreatePaymentIntentResponseSchema = z
  .strictObject({
    job_id: IdScalar,
    amount_cents: PositiveIntScalar,
    overpay: z.boolean(),
    client_secret: z.string().nonempty(),
  })
  .openapi({
    example: {
      job_id: 4555,
      amount_cents: 9000,
      overpay: false,
      client_secret:
        'pi_3OdZQIF2Ql2S36kO1xfU9v7c_secret_bAfiztmBkHafGD5cNYupiEp4L',
    },
  });

export type TCreatePaymentIntentResponseSchema = z.infer<
  typeof CreatePaymentIntentResponseSchema
>;

export const CreatePaymentIntentAction: TOpenAPIAction = {
  title: 'CreatePaymentIntentSchema',
  method: Method.POST,
  path: '/jobs/{id}/payment-intent',
  description: 'Initiate a Stripe payment-intent for a job',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: CreatePaymentIntentPathParamsSchema,
    body: {
      content: CreatePaymentIntentRequestSchema,
    },
  },
  response: {
    content: CreatePaymentIntentResponseSchema,
  },
};
