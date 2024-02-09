import { useQuery } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import { mountPersonObject } from '@/app/(app)/_utils';
import type { Dispatcher } from '@/app/(app)/jobs/(index)/_types';

type GetDispatchersAPIResponse = {
  data: Dispatcher[];
};

type GetDispatchersParams = {
  companyId?: number;
  name?: string;
};

async function getDispatchers({ companyId, name }: GetDispatchersParams) {
  const response = await api.get<GetDispatchersAPIResponse>('dispatchers', {
    params: {
      size: 10,
      ...(typeof companyId === 'number'
        ? { company_id: `eq:${companyId}` }
        : {}),
      ...(name?.trim() ? { firstname: `ilike:%${name.trim()}%` } : {}),
    },
  });

  return response.data.data.map(dispatcher => ({
    ...dispatcher,
    ...mountPersonObject(dispatcher),
  }));
}

const QUERY_KEY = 'useGetDispatchers';

export function useGetDispatchers(params: GetDispatchersParams) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getDispatchers(params),
    enabled: typeof params.companyId === 'number',
    keepPreviousData: typeof params.companyId === 'number',
  });
}

useGetDispatchers.queryKey = QUERY_KEY;
