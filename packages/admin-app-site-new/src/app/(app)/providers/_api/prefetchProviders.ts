import {
  decodeQueryParams,
  NumberParam,
  ObjectParam,
  StringParam,
} from '@/app/_lib/serializeQueryParams';
import { DEFAULT_PAGE_SIZE } from '@/app/(app)/_constants';
import { fetchOnServerGuard } from '@/app/(app)/_utils/fetchOnServerGuard';
import {
  useGetProviders,
  useGetProvidersCount,
} from '@/app/(app)/providers/_api';

import { cashBalanceModelSchema, statusSchema } from '../_types';

type PrefetchProvidersParams = {
  searchParams: Record<string, string>;
};

export async function prefetchProviders({
  searchParams,
}: PrefetchProvidersParams) {
  let providers;
  let providersCount;

  const { cookies } = await fetchOnServerGuard(searchParams, async () => {
    const { status, order, page, size, balance, search } = decodeQueryParams(
      {
        status: StringParam,
        order: ObjectParam,
        page: NumberParam,
        size: NumberParam,
        balance: ObjectParam,
        search: StringParam,
      },
      searchParams
    );

    if (balance?.values) {
      balance.values = balance.values.split(',') as unknown as string;
    }

    const parsedBalance = cashBalanceModelSchema.safeParse(balance);
    const parsedStatus = statusSchema.safeParse(status);

    try {
      [providers, providersCount] = await Promise.all([
        useGetProviders.queryFn({
          status: parsedStatus.success ? parsedStatus.data : 'approved',
          page: page ? page - 1 : 0,
          size: size ?? DEFAULT_PAGE_SIZE,
          order,
          ...(!!search && search.trim().length > 0 ? { search } : {}),
          ...(parsedBalance.success && parsedBalance.data.values[0].length > 0
            ? {
                balance: `${
                  parsedBalance.data.operator
                }:${parsedBalance.data.values.join('+')}`,
              }
            : {}),
        }),
        useGetProvidersCount.queryFn(),
      ]);
    } catch (err) {
      console.error('Error fetching providers', err);
    }
  });

  const providersColumns = cookies.get('providers-columns')?.value;

  return {
    providers,
    providersCount,
    providersColumns: providersColumns
      ? (JSON.parse(providersColumns) as Record<string, boolean>)
      : {},
  };
}
