import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import type { TOpenAPIAction } from '@openAPI/types';
import {
  IdScalar,
  MomentExample,
  MomentShape,
  PathIdScalar,
} from '@utils/schema';
import { jobPaymentsItemPaymentMethodSchema } from 'db/schema/jobPaymentsItems';

export const UpdateJobPaymentsItemRequestSchema = z
  .object({
    identifier: z.string(),
    payment_method: jobPaymentsItemPaymentMethodSchema,
    amount_cents: z.number().int().positive(),
    stripe_payment_id: z.string().nullable(),
    provider_id: IdScalar.nullable(),
  })
  .openapi({
    example: {
      identifier: 'xsa321',
      payment_method: 'cash',
      amount_cents: 1000,
      stripe_payment_id: null,
      provider_id: 138,
    },
  });

const UpdateJobPaymentsItemResponseSchema = z
  .object({
    ...MomentShape,
    job_id: IdScalar,
  })
  .merge(UpdateJobPaymentsItemRequestSchema)
  .openapi({
    example: {
      ...MomentExample,
      job_id: 4660,
      amount_cents: 2000,
      payment_method: 'cash',
      identifier: 'xsa123',
      stripe_payment_id: null,
      provider_id: 138,
    },
  });

const PathParamsSchema = z.object({
  id: PathIdScalar,
  chargesId: PathIdScalar,
});

export const UpdateJobPaymentsItemAction: TOpenAPIAction = {
  title: 'JobPaymentsItemSchema',
  method: Method.PATCH,
  path: '/jobs/{id}/charges/{chargesId}',
  description: 'Update a job charges item',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
    body: {
      content: UpdateJobPaymentsItemRequestSchema,
    },
  },
  response: {
    content: UpdateJobPaymentsItemResponseSchema,
  },
};

export const DeleteJobPaymentsItemAction: TOpenAPIAction = {
  title: 'JobPaymentsItemSchema',
  method: Method.DELETE,
  path: '/jobs/{id}/charges/{chargesId}',
  description: 'Delete a job charges item',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
  },
  response: {
    content: z.object({}),
  },
};
