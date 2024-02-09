import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import type { TOpenAPIAction } from '@openAPI/types';
import {
  IdScalar,
  MomentExample,
  MomentShape,
  PathIdScalar,
} from '@utils/schema';

export const UpdateJobEarningsItemRequestSchema = z
  .object({
    description: z.string(),
    quantity: z.number().positive().multipleOf(0.01),
    unit_price_cents: z.number().int().positive(),
  })
  .openapi({
    example: {
      description: 'Parking ticket',
      quantity: 1.13,
      unit_price_cents: 150,
    },
  });

const UpdateJobEarningsItemResponseSchema = z
  .object({
    ...MomentShape,
    job_id: IdScalar,
    provider_id: IdScalar,
  })
  .merge(UpdateJobEarningsItemRequestSchema)
  .merge(
    z.object({
      quantity: z.string(), // Overwrite the quantity from number to string
    })
  )
  .openapi({
    example: {
      ...MomentExample,
      job_id: 4660,
      provider_id: 138,
      description: 'Parking ticket',
      quantity: '1.13',
      unit_price_cents: 150,
    },
  });

const PathParamsSchema = z.object({
  id: PathIdScalar,
  earningsId: PathIdScalar,
});

export const UpdateJobEarningsItemAction: TOpenAPIAction = {
  title: 'JobEarningsItemSchema',
  method: Method.PATCH,
  path: '/jobs/{id}/earnings/{earningsId}',
  description: 'Update a job earnings item',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
    body: {
      content: UpdateJobEarningsItemRequestSchema,
    },
  },
  response: {
    content: UpdateJobEarningsItemResponseSchema,
  },
};

export const DeleteJobEarningsItemAction: TOpenAPIAction = {
  title: 'JobEarningsItemSchema',
  method: Method.DELETE,
  path: '/jobs/{id}/earnings/{earningsId}',
  description: 'Delete a job earnings item',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
  },
  response: {
    content: z.object({}),
  },
};
