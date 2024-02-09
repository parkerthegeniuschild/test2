import { z } from 'zod';
import { useDb } from 'db/dbClient';
import { jobInvoices as jobInvoicesSchema } from 'db/schema/jobInvoices';
import { IdScalar } from '@utils/schema';
import { TruckupNotFoundError } from 'src/errors';
import { TDatabaseOrTransaction } from '@utils/dbTransaction';
import { getJobById } from './jobs';
import { getJobPaymentsItemAction } from './charges';

// eslint-disable-next-line import/no-self-import
export * as JobInvoice from './jobInvoice';

const createSchema = z.object({
  createdBy: z.string(),
  jobId: IdScalar,
});

type TCreateParams = z.infer<typeof createSchema>;

export const create = async (
  params: TCreateParams,
  db: TDatabaseOrTransaction = useDb()
) => {
  const values = createSchema.parse(params);

  const [invoice] = await db
    .insert(jobInvoicesSchema)
    .values(values)
    .returning();

  return invoice;
};

/** This method uses onConflictDoUpdate to return the existing invoice if a conflict occurs
  because onConflictDoNothing returns undefined. This is good especially when the updated_at
  field isn't configured to be changed automatically by the DB engine; so the row data remains unchanged.
  */
export const getOrCreate = async (
  params: TCreateParams,
  db: TDatabaseOrTransaction = useDb()
) => {
  const values = createSchema.parse(params);

  const [invoice] = await db
    .insert(jobInvoicesSchema)
    .values(values)
    .onConflictDoUpdate({
      target: jobInvoicesSchema.jobId,
      set: { jobId: values.jobId },
    })
    .returning();

  return invoice;
};

export const getAllJobCharges = async (jobId: number) => {
  const [job, paymentsItem] = await Promise.all([
    getJobById(jobId),
    getJobPaymentsItemAction(jobId),
  ]);

  if (!job || !paymentsItem) throw new TruckupNotFoundError();

  return {
    ...paymentsItem,
    job,
  };
};
