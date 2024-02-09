import { TDatabaseOrTransaction } from '@utils/dbTransaction';
import { useDb } from 'db/dbClient';
import {
  ICreateJobPaymentsItemsSchema,
  IUpdateJobPaymentsItemsSchema,
  jobPaymentsItems as jobPaymentsItemsSchema,
} from 'db/schema/jobPaymentsItems';
import { providers as providersSchema } from 'db/schema/providers';
import { and, eq, sql } from 'drizzle-orm';

interface TGetJobPaymentByStripePaymentIdParams {
  jobId: number;
  stripePaymentId: string;
}
export const getJobPaymentByStripePaymentId = async (
  { jobId, stripePaymentId }: TGetJobPaymentByStripePaymentIdParams,
  db: TDatabaseOrTransaction = useDb()
) => {
  const [item = undefined] = await db
    .select()
    .from(jobPaymentsItemsSchema)
    .where(
      and(
        eq(jobPaymentsItemsSchema.stripePaymentId, stripePaymentId),
        jobId ? eq(jobPaymentsItemsSchema.jobId, jobId) : undefined
      )
    );
  return item;
};

interface IGetJobPaymentsItemsInput {
  itemId: number;
  dbInstance?: TDatabaseOrTransaction;
}
export const getJobPaymentsItemById = async ({
  itemId,
  dbInstance = useDb(),
}: IGetJobPaymentsItemsInput) => {
  const item = await dbInstance
    .select()
    .from(jobPaymentsItemsSchema)
    .where(eq(jobPaymentsItemsSchema.id, itemId));
  return item.length ? item[0] : null;
};

interface IListJobPaymentsItemByJobIdInput {
  jobId: number;
  dbInstance?: TDatabaseOrTransaction;
}
export const listJobPaymentsItemByJobId = async ({
  jobId,
  dbInstance = useDb(),
}: IListJobPaymentsItemByJobIdInput) => {
  return (
    (await dbInstance
      .select({
        id: jobPaymentsItemsSchema.id,
        createdBy: jobPaymentsItemsSchema.createdBy,
        createdAt: jobPaymentsItemsSchema.createdAt,
        updatedBy: jobPaymentsItemsSchema.updatedBy,
        updatedAt: jobPaymentsItemsSchema.updatedAt,
        jobId: jobPaymentsItemsSchema.jobId,
        amountCents: jobPaymentsItemsSchema.amountCents,
        paymentMethod: jobPaymentsItemsSchema.paymentMethod,
        identifier: jobPaymentsItemsSchema.identifier,
        stripePaymentId: jobPaymentsItemsSchema.stripePaymentId,
        providerId: jobPaymentsItemsSchema.providerId,
        providerName: sql<string>`CASE WHEN ${providersSchema.firstname} IS NOT NULL THEN CONCAT(${providersSchema.firstname}, ' ', ${providersSchema.lastname}) END`,
      })
      .from(jobPaymentsItemsSchema)
      .leftJoin(
        providersSchema,
        eq(providersSchema.id, jobPaymentsItemsSchema.providerId)
      )
      .where(eq(jobPaymentsItemsSchema.jobId, jobId))) || []
  );
};

interface ICreatePaymentsItemInput {
  body: ICreateJobPaymentsItemsSchema;
  dbInstance?: TDatabaseOrTransaction;
}

export const createPaymentsItem = async ({
  body,
  dbInstance = useDb(),
}: ICreatePaymentsItemInput) => {
  const item = await dbInstance
    .insert(jobPaymentsItemsSchema)
    .values(body)
    .returning();
  return item.length ? item[0] : null;
};

interface IUpdatePaymentsItemInputWhere {
  id: number;
  jobId: number;
}

interface IUpdatePaymentsItemInput {
  body: IUpdateJobPaymentsItemsSchema;
  where: IUpdatePaymentsItemInputWhere;
  dbInstance?: TDatabaseOrTransaction;
}

export const updatePaymentsItem = async ({
  body,
  where,
  dbInstance = useDb(),
}: IUpdatePaymentsItemInput) => {
  const { id, ...newData } = body;
  const item = await dbInstance
    .update(jobPaymentsItemsSchema)
    .set(newData)
    .where(
      and(
        eq(jobPaymentsItemsSchema.id, where.id),
        eq(jobPaymentsItemsSchema.jobId, where.jobId)
      )
    )
    .returning();
  return item.length ? item[0] : null;
};

interface IDeletePaymentsItem {
  itemId: number;
  dbInstance?: TDatabaseOrTransaction;
}

export const deletePaymentsItem = async ({
  itemId,
  dbInstance = useDb(),
}: IDeletePaymentsItem) => {
  const deleted = await dbInstance
    .delete(jobPaymentsItemsSchema)
    .where(eq(jobPaymentsItemsSchema.id, itemId))
    .returning();
  return deleted.length ? deleted[0] : undefined;
};
