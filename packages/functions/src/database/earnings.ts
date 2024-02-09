import { TDatabaseOrTransaction } from '@utils/dbTransaction';
import { useDb } from 'db/dbClient';
import {
  ICreateJobEarningsItemsSchema,
  IUpdateJobEarningsItemsSchema,
  jobEarningsItems,
} from 'db/schema/jobEarningsItems';
import { and, eq } from 'drizzle-orm';

interface IListJobEarningsItemByJobIdInput {
  jobId: number;
  dbInstance?: TDatabaseOrTransaction;
}
export const listJobEarningsItemByJobId = async ({
  jobId,
  dbInstance = useDb(),
}: IListJobEarningsItemByJobIdInput) => {
  return (
    (await dbInstance
      .select()
      .from(jobEarningsItems)
      .where(eq(jobEarningsItems.jobId, jobId))) || []
  );
};

interface IGetJobEarningsItemsInput {
  itemId: number;
  dbInstance?: TDatabaseOrTransaction;
}
export const getJobEarningsItemById = async ({
  itemId,
  dbInstance = useDb(),
}: IGetJobEarningsItemsInput) => {
  const item = await dbInstance
    .select()
    .from(jobEarningsItems)
    .where(eq(jobEarningsItems.id, itemId));
  return item.length ? item[0] : null;
};

interface ICreateEarningsItemInput {
  body: ICreateJobEarningsItemsSchema;
  dbInstance?: TDatabaseOrTransaction;
}

export const createEarningsItem = async ({
  body,
  dbInstance = useDb(),
}: ICreateEarningsItemInput) => {
  const item = await dbInstance
    .insert(jobEarningsItems)
    .values(body)
    .returning();
  return item.length ? item[0] : null;
};

interface IUpdateEarningsItemInputWhere {
  id: number;
  jobId: number;
}

interface IUpdateEarningsItemInput {
  body: IUpdateJobEarningsItemsSchema;
  where: IUpdateEarningsItemInputWhere;
  dbInstance?: TDatabaseOrTransaction;
}

export const updateEarningsItem = async ({
  body,
  where,
  dbInstance = useDb(),
}: IUpdateEarningsItemInput) => {
  const item = await dbInstance
    .update(jobEarningsItems)
    .set({
      description: body.description,
      quantity: `${body.quantity}`,
      unitPriceCents: body.unitPriceCents,
    })
    .where(
      and(
        eq(jobEarningsItems.id, where.id),
        eq(jobEarningsItems.jobId, where.jobId)
      )
    )
    .returning();
  return item.length ? item[0] : null;
};

interface IDeleteEarningsItem {
  itemId: number;
  dbInstance?: TDatabaseOrTransaction;
}

export const deleteEarningsItem = async ({
  itemId,
  dbInstance = useDb(),
}: IDeleteEarningsItem) => {
  const deleted = await dbInstance
    .delete(jobEarningsItems)
    .where(eq(jobEarningsItems.id, itemId))
    .returning();
  return deleted.length ? deleted[0] : undefined;
};
