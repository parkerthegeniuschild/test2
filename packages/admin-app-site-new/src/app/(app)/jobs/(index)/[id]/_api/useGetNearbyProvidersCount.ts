import { useQuery } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { PaginationModel } from '@/app/_types/api';

type GetNearbyProvidersCountParams = {
  jobId: string;
  mileRadius: string;
};

type UseGetNearbyProvidersCountAPIResponse = {
  page: PaginationModel;
};

async function getNearbyProvidersCount({
  jobId,
  mileRadius,
}: GetNearbyProvidersCountParams) {
  const [onlineResponse, offlineResponse] = await Promise.all([
    api.get<UseGetNearbyProvidersCountAPIResponse>(
      `/jobs/${jobId}/nearby-providers`,
      {
        params: {
          is_online: 'eq:true',
          radius: mileRadius,
          size: 1,
        },
      }
    ),
    api.get<UseGetNearbyProvidersCountAPIResponse>(
      `/jobs/${jobId}/nearby-providers`,
      {
        params: {
          is_online: 'eq:false',
          radius: mileRadius,
          size: 1,
        },
      }
    ),
  ]);

  return {
    online: onlineResponse.data.page.totalElements,
    offline: offlineResponse.data.page.totalElements,
  };
}

const QUERY_KEY = 'useGetNearbyProvidersCount';

type UseGetNearbyProvidersCountParams = {
  enabled?: boolean;
};

export function useGetNearbyProvidersCount(
  params: GetNearbyProvidersCountParams,
  { enabled }: UseGetNearbyProvidersCountParams = {}
) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getNearbyProvidersCount(params),
    enabled,
    refetchInterval: 30 * 1000, // 30 seconds
  });
}

useGetNearbyProvidersCount.queryKey = QUERY_KEY;
