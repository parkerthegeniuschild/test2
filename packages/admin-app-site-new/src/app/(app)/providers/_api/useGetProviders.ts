import { useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { Operator, PaginationModel } from '@/app/_types/api';
import type { OrderModel } from '@/app/_types/order';
import { format } from '@/app/_utils';
import { mountOrderObject, mountPersonObject } from '@/app/(app)/_utils';

import type { Provider, Status } from '../_types';

type GetProvidersAPIResponse = {
  providers: Provider[];
  paginationData: PaginationModel;
};

export type GetProvidersParams = {
  size: number;
  page: number;
  status: Status;
  balance?: `${Operator}:${string}`;
  search?: string;
  order?: OrderModel<keyof Provider> | null;
};

async function getProviders({
  status,
  search,
  order,
  ...params
}: GetProvidersParams) {
  const response = await api.get<GetProvidersAPIResponse>('providers', {
    params: {
      joins: 'completedJobsCount,acceptedRate',
      is_blocked: `eq:${status === 'unapproved'}`,
      ...mountOrderObject(order),
      ...(search ? { firstname: `ilike:%${search}%` } : {}),
      ...params,
    },
  });

  return {
    ...response.data,
    providers: response.data.providers.map(provider => ({
      ...provider,
      status: (provider.is_blocked ? 'unapproved' : 'approved') as Status,
      rating: provider.rating
        ? Number.parseFloat(provider.rating).toFixed(1)
        : null,
      rawRating: provider.rating ? Number.parseFloat(provider.rating) : null,
      acceptedRate: provider.acceptedRate
        ? Math.round(provider.acceptedRate * 100)
        : null,
      balance: format.currency(Number.parseFloat(provider.balance)),
      rawBalance: Number.parseFloat(provider.balance),
      ...mountPersonObject(provider),
    })),
  };
}

type GetProvidersParsedResponse = Awaited<ReturnType<typeof getProviders>>;
export type ProviderParsed = GetProvidersParsedResponse['providers'][number];

const QUERY_KEY = 'useGetProviders';

export type UseGetProvidersOptions = {
  initialData?: GetProvidersParsedResponse;
};

export function useGetProviders(
  params: GetProvidersParams,
  { initialData }: UseGetProvidersOptions = {}
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getProviders(params),
    initialData: () => {
      const isFirstCache =
        queryClient.getQueriesData({ queryKey: [QUERY_KEY] }).length === 0;

      return isFirstCache ? initialData : undefined;
    },
  });
}

useGetProviders.queryKey = QUERY_KEY;
useGetProviders.queryFn = getProviders;
