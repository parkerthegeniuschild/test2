import { useQuery } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { PaginationModel } from '@/app/_types/api';
import { format } from '@/app/_utils';

type GetProvidersAPIResponse = {
  paginationData: PaginationModel;
};

async function getProvidersCount() {
  const [approvedResponse, unapprovedResponse] = await Promise.all([
    api.get<GetProvidersAPIResponse>('providers', {
      params: {
        joins: 'completedJobsCount,acceptedRate',
        is_blocked: 'eq:false',
        size: 1,
      },
    }),
    api.get<GetProvidersAPIResponse>('providers', {
      params: {
        joins: 'completedJobsCount,acceptedRate',
        is_blocked: 'eq:true',
        size: 1,
      },
    }),
  ]);

  return {
    approved: format.number(approvedResponse.data.paginationData.totalElements),
    unapproved: format.number(
      unapprovedResponse.data.paginationData.totalElements
    ),
  };
}

const QUERY_KEY = 'useGetProvidersCount';

export type UseGetProvidersCountOptions = {
  initialData?: Awaited<ReturnType<typeof getProvidersCount>>;
};

export function useGetProvidersCount(
  options: UseGetProvidersCountOptions = {}
) {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getProvidersCount,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: Infinity,
    ...options,
  });
}

useGetProvidersCount.queryKey = QUERY_KEY;
useGetProvidersCount.queryFn = getProvidersCount;
