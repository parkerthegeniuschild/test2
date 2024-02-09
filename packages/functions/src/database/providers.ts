import { and, eq } from 'drizzle-orm';
import { providers as providersSchema } from 'db/schema/providers';
import { providerRates as providerRatesSchema } from 'db/schema/providerRates';
import { useDb } from 'db/dbClient';
import { TDatabaseOrTransaction } from '@utils/dbTransaction';
import { getProviderRateIds } from '@utils/helpers';

const db = useDb({
  providers: providersSchema,
  providerRates: providerRatesSchema,
});

interface IGetProviderRatesInput {
  providerId: number;
  dbInstance?: TDatabaseOrTransaction;
}

export const getProviderRates = async ({
  providerId,
  dbInstance = db,
}: IGetProviderRatesInput) => {
  const providerRateIds = await getProviderRateIds();

  const promises = await Promise.all([
    dbInstance
      .select()
      .from(providerRatesSchema)
      .where(
        and(
          eq(providerRatesSchema.provider_id, providerId),
          eq(providerRatesSchema.rate_id, providerRateIds.callout)
        )
      ),
    dbInstance
      .select()
      .from(providerRatesSchema)
      .where(
        and(
          eq(providerRatesSchema.provider_id, providerId),
          eq(providerRatesSchema.rate_id, providerRateIds.rate)
        )
      ),
  ]);

  const callout = promises[0].length ? parseInt(promises[0][0].value, 10) : 0;
  const rate = promises[1].length ? parseInt(promises[1][0].value, 10) : 0;

  return { callout, rate };
};
