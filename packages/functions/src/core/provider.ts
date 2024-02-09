import { useDb } from 'db/dbClient';
import { z } from 'zod';
import {
  providers as providerSchema,
  updateProviderSchema,
} from 'db/schema/providers';
import { ProviderType } from '@utils/constants';
import { enumFromConst, IdScalar } from '@utils/schema';
import {
  TDatabaseOrTransaction,
  type TTransaction,
} from '@utils/dbTransaction';
import { CreateProviderRequestSchema } from 'src/providers/open-api';
import {
  ICreateProviderRateSchema,
  providerRates as providerRatesSchema,
} from 'db/schema/providerRates';
import {
  getDefaultProviderRates,
  getProviderRateIds,
  IUpdatedProps,
} from '@utils/helpers';
import { and, eq, inArray, sql } from 'drizzle-orm';
import {
  TruckupBadRequestError,
  TruckupInternalServerErrorError,
  TruckupNotFoundError,
} from 'src/errors';
import { jobs } from 'db/schema/jobs';
import { STATUS_PROVIDER_ON_JOB } from './jobs';

// eslint-disable-next-line import/no-self-import
export * as Provider from './provider';

const createSchema = CreateProviderRequestSchema.omit({
  address1: true,
  address2: true,
}).extend({
  address: z.string().nonempty(),
  address_two: z.string().nonempty().optional(),
  created_by: z.string().nonempty(),
  app_user_id: IdScalar,
  provider_type: enumFromConst(ProviderType),
  rating: z.string(),
});

export type TCreateParams = z.infer<typeof createSchema>;

export const create = async (
  params: TCreateParams,
  transaction: TTransaction,
  skipParse: boolean = false
) => {
  const values = !skipParse ? createSchema.parse(params) : params;

  const dbInstance = transaction || useDb();

  const [provider] = await dbInstance
    .insert(providerSchema)
    .values(values)
    .returning();

  return provider;
};

interface ICreateRatesInput {
  body: ICreateProviderRateSchema;
  dbInstance: TDatabaseOrTransaction;
}

export const createRate = async ({
  body,
  dbInstance = useDb(),
}: ICreateRatesInput) => {
  const [providerRate] = await dbInstance
    .insert(providerRatesSchema)
    .values(body)
    .returning();

  return providerRate;
};

export const createAllProviderRates = async ({
  body,
  dbInstance = useDb(),
}: ICreateRatesInput) => {
  const rates = await getProviderRateIds();
  const values = await getDefaultProviderRates();

  const callout = await createRate({
    body: { ...body, rate_id: rates.callout, value: values.callout.toString() },
    dbInstance,
  });

  const rate = await createRate({
    body: { ...body, rate_id: rates.rate, value: values.rate.toString() },
    dbInstance,
  });

  return {
    callout,
    rate,
  };
};

export const update = async (
  providerId: number,
  _updates: z.infer<typeof updateProviderSchema>,
  tx: TTransaction
) => {
  const updates = updateProviderSchema.parse(_updates);
  if (updates.is_online !== undefined) {
    await assertNotOnJob(providerId, tx);
  }
  const [res = undefined] = await tx
    .update(providerSchema)
    .set(updates)
    .where(eq(providerSchema.id, providerId))
    .returning();
  if (!res) throw new TruckupNotFoundError();
  return res;
};

// marks the provider as unapproved
export const del = async (
  providerId: number,
  updatedProps: IUpdatedProps,
  tx: TDatabaseOrTransaction = useDb()
) => {
  const isProvider = eq(providerSchema.id, providerId);
  const [deleted = undefined] = await tx
    .update(providerSchema)
    .set({ is_unapproved: true, ...updatedProps })
    .where(and(isProvider, eq(providerSchema.is_unapproved, false)))
    .returning();
  if (!deleted) {
    // this is ok in or out of the transaction, since it is just the error response
    // and only happens when the first operation does not succeed
    const [original = undefined] = await tx
      .select()
      .from(providerSchema)
      .where(isProvider);
    if (original && original.is_unapproved !== true)
      throw new TruckupInternalServerErrorError();
  }
};

export const getOnJobStatus = async (providerId: number, tx: TTransaction) => {
  const [res = undefined] = await tx
    .select({ id: jobs.id })
    .from(jobs)
    .where(
      and(
        eq(jobs.provider_id, providerId),
        inArray(jobs.status_id, STATUS_PROVIDER_ON_JOB)
      )
    );
  return !!res;
};

export const assertNotOnJob = async (providerId: number, tx: TTransaction) => {
  const isOnJob = await getOnJobStatus(providerId, tx);
  if (isOnJob) throw new TruckupBadRequestError(`Provider is on a job`);
};

export const calculate = {
  isOnJob: sql<boolean>`COUNT(${jobs.id}) > 0`,
  isBlocked: sql<boolean>`${providerSchema.is_blocked} OR ${providerSchema.is_unapproved}`,
};

export const condition = {
  jobIsOnJob: and(
    eq(jobs.provider_id, providerSchema.id),
    inArray(jobs.status_id, STATUS_PROVIDER_ON_JOB)
  ),
};
