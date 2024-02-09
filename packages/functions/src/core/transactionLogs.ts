import { z } from 'zod';
import { useDb } from 'db/dbClient';
import { and, eq, sql } from 'drizzle-orm';
import { IdScalar } from '@utils/schema';
import { dbTransactionLogs } from 'db/schema/transactionLogs';
import { TransformedEvent } from '@utils/helpers';
import { jobs } from 'db/schema/jobs';

// eslint-disable-next-line import/no-self-import
export * as TransactionLogs from './transactionLogs';

const dbSchema = { transactionLogs: dbTransactionLogs };

const _generateWhere = ({ jobId, providerId }: TListParams) => {
  if (!jobId && !providerId) return undefined;
  return and(
    jobId ? eq(dbTransactionLogs.jobId, jobId) : undefined,
    providerId ? eq(dbTransactionLogs.providerId, providerId) : undefined
  );
};

export const ListSchema = z.object({
  jobId: IdScalar.optional(),
  providerId: IdScalar.optional(),
});
export type TListParams = z.infer<typeof ListSchema>;
export const list = async (
  params: TListParams,
  transformedEvent: TransformedEvent
) => {
  const { offset, size, orderBy, filters } = transformedEvent;
  const { jobId, providerId } = ListSchema.parse(params);
  const db = useDb(dbSchema);
  const where = and(filters, _generateWhere({ jobId, providerId }));
  const [comments, [{ total }]] = await Promise.all([
    db
      .select({
        id: dbTransactionLogs.id,
        createdAt: dbTransactionLogs.createdAt,
        createdBy: dbTransactionLogs.createdBy,
        updatedAt: dbTransactionLogs.updatedAt,
        updatedBy: dbTransactionLogs.updatedBy,
        type: dbTransactionLogs.type,
        source: dbTransactionLogs.source,
        amountCents: dbTransactionLogs.amountCents,
        balanceCents: dbTransactionLogs.balanceCents,
        job: {
          id: jobs.id,
          locationCity: jobs.location_city,
          locationState: jobs.location_state,
        },
        providerId: dbTransactionLogs.providerId,
        notes: dbTransactionLogs.notes,
      })
      .from(dbTransactionLogs)
      .where(where)
      .leftJoin(jobs, eq(jobs.id, dbTransactionLogs.jobId))
      .offset(offset)
      .limit(size)
      .orderBy(orderBy),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(dbTransactionLogs)
      .where(where),
  ]);
  return [comments, total] as const;
};
