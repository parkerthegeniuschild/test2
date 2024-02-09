import { useQuery } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import type { RecentLocation } from '../_types';

type GetProviderLocationsAPIResponse = {
  data: RecentLocation[];
};

type GetProviderLocationsParams = {
  providerId: number;
  timeFrom?: number;
  timeTo?: number;
};

async function getProviderLocations({
  providerId,
  ...params
}: GetProviderLocationsParams) {
  const response = await api.get<GetProviderLocationsAPIResponse>(
    `/providers/${providerId}/locations`,
    { params: { size: 500, sort: 'timestamp', order: 'desc', ...params } }
  );

  return response.data.data;
}

export type UseGetProviderLocationsOptions = {
  initialData?: Awaited<ReturnType<typeof getProviderLocations>>;
};

export function useGetProviderLocations(
  params: GetProviderLocationsParams,
  { initialData }: UseGetProviderLocationsOptions = {}
) {
  const isGettingPresentOrFutureData =
    !params.timeTo || params.timeTo >= Date.now();

  return useQuery({
    queryKey: ['useGetProviderLocations', params],
    queryFn: () => getProviderLocations(params),
    staleTime: isGettingPresentOrFutureData ? 0 : undefined,
    refetchInterval: isGettingPresentOrFutureData ? 1000 * 30 : undefined, // 30 seconds
    initialData,
  });
}

useGetProviderLocations.queryFn = getProviderLocations;
