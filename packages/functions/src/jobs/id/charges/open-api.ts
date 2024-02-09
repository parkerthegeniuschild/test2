import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import type { TOpenAPIAction } from '@openAPI/types';
import {
  IdScalar,
  MomentExample,
  MomentShape,
  PositiveIntScalar,
} from '@utils/schema';
import { jobPaymentsItemPaymentMethodSchema } from 'db/schema/jobPaymentsItems';

export const CreateJobPaymentsItemRequestSchema = z
  .object({
    amount_cents: PositiveIntScalar,
    payment_method: jobPaymentsItemPaymentMethodSchema,
    identifier: z.string(),
    stripe_payment_id: z.string().nullable(),
    provider_id: IdScalar.nullable(),
  })
  .openapi({
    example: {
      amount_cents: 2000,
      payment_method: 'cash',
      identifier: 'xsa123',
      stripe_payment_id: null,
      provider_id: 138,
    },
  });

const CreateJobPaymentsItemResponseSchema = z
  .object({
    ...MomentShape,
    job_id: IdScalar,
  })
  .merge(CreateJobPaymentsItemRequestSchema)
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

const GetJobPaymentsItemsResponseSchema = z
  .object({
    charge: z.object({
      labor_hours_amount: z.number().multipleOf(0.25),
      surpassed_minimum: z.boolean(),
      labor_hours_unit_price_cents: z.number().int(),
      labor_hours_unit_price_cents_total: z.number().int(),
      parts_price_cents_total: z.number().int(),
      charge_callout_cents: z.number().int(),
      callout_price_cents: z.number().int(),
      fuel_surcharge_cents: z.number().int(),
      subtotal_price_cents: z.number().int(),
      tax_rate: z.number().int(),
      tax_price_cents: z.number().int(),
      total_price_cents: z.number().int(),
    }),
    payments: z.object({
      total_amount_paid_cents: z.number().int(),
      entries: z.array(CreateJobPaymentsItemResponseSchema.optional()),
    }),
    balance_cents: z.number().int(),
  })
  .openapi({
    example: {
      charge: {
        labor_hours_amount: 425.75,
        surpassed_minimum: true,
        labor_hours_unit_price_cents: 125,
        labor_hours_unit_price_cents_total: 53218,
        parts_price_cents_total: 840,
        charge_callout_cents: 1000,
        callout_price_cents: 1000,
        fuel_surcharge_cents: 0,
        subtotal_price_cents: 55058,
        tax_rate: 0,
        tax_price_cents: 0,
        total_price_cents: 55058,
      },
      payments: {
        total_amount_paid_cents: 0,
        entries: [],
      },
      balance_cents: 55058,
    },
  });

const PathParamsSchema = z.object({ id: z.string() });

export const CreateJobPaymentsItemAction: TOpenAPIAction = {
  title: 'JobPaymentsItemSchema',
  method: Method.POST,
  path: '/jobs/{id}/charges',
  description: 'Create a job charges item',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
    body: {
      content: CreateJobPaymentsItemRequestSchema,
    },
  },
  response: {
    content: CreateJobPaymentsItemResponseSchema,
  },
};

export const GetJobPaymentsItemAction: TOpenAPIAction = {
  title: 'JobPaymentsItemSchema',
  method: Method.GET,
  path: '/jobs/{id}/charges',
  description: 'Get job charges items',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
  },
  response: {
    content: GetJobPaymentsItemsResponseSchema,
  },
};
