import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import type { TOpenAPIAction } from '@openAPI/types';
import { IdScalar, MomentExample, MomentShape } from '@utils/schema';

export const CreateJobEarningsItemRequestSchema = z
  .object({
    description: z.string(),
    quantity: z.number().positive().multipleOf(0.01),
    unit_price_cents: z.number().int().positive(),
    provider_id: IdScalar,
  })
  .openapi({
    example: {
      description: 'Parking ticket',
      quantity: 1.13,
      unit_price_cents: 150,
      provider_id: 138,
    },
  });

const CreateJobEarningsItemResponseSchema = z
  .object({
    ...MomentShape,
    job_id: IdScalar,
  })
  .merge(CreateJobEarningsItemRequestSchema)
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

const GetJobEarningsItemsResponseSchema = z
  .object({
    job_id: IdScalar,
    provider_id: IdScalar,
    earnings_total_cents: z.number().int().positive(),
    per_hour_rate_cents: z.number().int().positive(),
    per_hour_amount: z.number().positive().multipleOf(0.25),
    per_hour_rate_total_cents: z.number().int().positive(),
    callout_rate_cents: z.number().int().positive(),
    items_total_price_cents: z.number().int().positive(),
    items: z.array(
      z.object({
        ...MomentShape,
        job_id: IdScalar,
        provider_id: IdScalar,
        description: z.string(),
        quantity: z.number().positive().multipleOf(0.01),
        unit_price_cents: z.number().int().positive(),
        total_price_cents: z.number().int().positive(),
      })
    ),
  })
  .openapi({
    example: {
      job_id: 4660,
      provider_id: 138,
      earnings_total_cents: 33517,
      per_hour_rate_cents: 125,
      per_hour_amount: 256.75,
      per_hour_rate_total_cents: 32093,
      callout_rate_cents: 1000,
      items_total_price_cents: 424,
      items: [
        {
          id: 2,
          created_by: 'admin',
          created_at: '2024-01-16T02:27:46.922Z',
          updated_by: null,
          updated_at: null,
          job_id: 4660,
          provider_id: 138,
          description: 'Parking ticket',
          quantity: 1,
          unit_price_cents: 150,
          total_price_cents: 150,
        },
        {
          id: 36,
          created_by: 'admin',
          created_at: '2024-01-16T17:48:56.877Z',
          updated_by: null,
          updated_at: null,
          job_id: 4660,
          provider_id: 138,
          description: 'Parking lot ticket',
          quantity: 1.22,
          unit_price_cents: 225,
          total_price_cents: 274,
        },
      ],
    },
  });

const PathParamsSchema = z.object({ id: z.string() });

export const CreateJobEarningsItemAction: TOpenAPIAction = {
  title: 'JobEarningsItemSchema',
  method: Method.POST,
  path: '/jobs/{id}/earnings',
  description: 'Create a job earnings item',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
    body: {
      content: CreateJobEarningsItemRequestSchema,
    },
  },
  response: {
    content: CreateJobEarningsItemResponseSchema,
  },
};

export const GetJobEarningsItemAction: TOpenAPIAction = {
  title: 'JobEarningsItemSchema',
  method: Method.GET,
  path: '/jobs/{id}/earnings',
  description: 'Get job earnings items',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
  },
  response: {
    content: GetJobEarningsItemsResponseSchema,
  },
};
