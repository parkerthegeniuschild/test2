import { z } from '@openAPI/config';
import { paginated } from '@openAPI/schema';
import type { TOpenAPIAction } from '@openAPI/types';
import {
  Method,
  TransactionLogSource,
  TransactionLogType,
} from '@utils/constants';
import { enumFromConst, IdScalar, MomentExample } from '@utils/schema';

export const ListTransactionsResponseSchema = paginated(
  z
    .strictObject({
      id: IdScalar,
      created_at: z.string().datetime(),
      created_by: z.string(),
      updated_at: z.string().datetime().nullable(),
      updated_by: z.string().nullable(),
      type: enumFromConst(TransactionLogType),
      source: enumFromConst(TransactionLogSource),
      amount_cents: z.number().int().positive(),
      balance_cents: z.number().int(),
      job: z
        .strictObject({
          id: IdScalar,
          location_city: z.string().nonempty(),
          location_state: z.string().nonempty(),
        })
        .nullable(),
      provider_id: IdScalar,
      notes: z.string().nullable(),
    })
    .openapi({
      example: {
        ...MomentExample,
        type: TransactionLogType.CREDIT,
        source: TransactionLogSource.JOB_PAYMENT,
        amount_cents: 1337,
        balance_cents: 900101,
        job: {
          id: 789,
          location_city: 'Hollywood',
          location_state: 'CA',
        },
        provider_id: 234,
        notes: `Manual notes about this transaction`,
      },
    })
);

export const ListTransactionsAction: TOpenAPIAction = {
  title: 'TransactionsSchema',
  method: Method.GET,
  path: '/transactions',
  description: 'Lists balance transactions',
  isProtected: true,
  response: {
    content: ListTransactionsResponseSchema,
  },
};
