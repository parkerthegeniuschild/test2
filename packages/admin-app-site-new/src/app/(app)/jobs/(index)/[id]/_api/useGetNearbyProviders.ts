import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  differenceInDays,
  formatDistanceToNow,
  formatDistanceToNowStrictSimplified,
} from '@/app/_lib/dateFns';
import { api } from '@/app/_services/api';
import { mountPersonObject, providerFlagsToStatus } from '@/app/(app)/_utils';

import type { JobRequest } from '../_types';

type GetNearbyProvidersParams = {
  jobId: string;
  isOnline: boolean;
  mileRadius: string;
};

type GetNearbyProvidersAPIResponse = {
  data: Array<{
    id: number;
    distance?: number;
    firstname: string;
    lastname: string;
    is_blocked: boolean;
    is_onjob: boolean;
    is_online: boolean;
    latitude?: number;
    longitude?: number;
    location_updated_at?: string;
    phone?: string;
    rating: string;
    job_request: JobRequest | null;
  }>;
};

async function getNearbyProviders({
  jobId,
  isOnline,
  mileRadius,
}: GetNearbyProvidersParams) {
  const response = await api.get<GetNearbyProvidersAPIResponse>(
    `/jobs/${jobId}/nearby-providers`,
    {
      params: {
        is_online: `eq:${isOnline}`,
        radius: mileRadius,
        // TODO: add an infinite scroll pagination instead of fixing the size
        size: 100,
      },
    }
  );

  return {
    ...response.data,
    data: response.data.data.map(provider => {
      const { status, statusText } = providerFlagsToStatus(provider);

      return {
        ...provider,
        job_request: provider.job_request
          ? {
              ...provider.job_request,
              timeDistance: formatDistanceToNowStrictSimplified(
                new Date(
                  provider.job_request.updated_at ??
                    provider.job_request.created_at
                ),
                { addSuffix: true }
              ),
            }
          : null,
        distance: provider.distance?.toFixed(2),
        status,
        statusText,
        rating: parseFloat(provider.rating).toFixed(1),
        rawRating: parseFloat(provider.rating),
        daysFromLastKnownLocation: provider.location_updated_at
          ? differenceInDays(new Date(), new Date(provider.location_updated_at))
          : null,
        lastKnownLocationTimeDistance: provider.location_updated_at
          ? formatDistanceToNow(new Date(provider.location_updated_at), {
              addSuffix: true,
            })
          : null,
        ...mountPersonObject(provider),
      };
    }),
  };
}

const QUERY_KEY = 'useGetNearbyProviders';

export type ProviderParsed = Awaited<
  ReturnType<typeof getNearbyProviders>
>['data'][number];

type UseGetNearbyProvidersParams = {
  enabled?: boolean;
};

export function useGetNearbyProviders(
  params: GetNearbyProvidersParams,
  { enabled }: UseGetNearbyProvidersParams = {}
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getNearbyProviders(params),
    enabled,
    refetchInterval: 30 * 1000, // 30 seconds
  });

  return Object.assign(query, {
    updateProviderJobRequest(providerId: number, payload: JobRequest) {
      queryClient.setQueryData([QUERY_KEY, params], oldData => {
        if (!oldData) {
          return oldData;
        }

        const data = oldData as Awaited<ReturnType<typeof getNearbyProviders>>;

        return {
          ...data,
          data: data.data.map(provider => ({
            ...provider,
            job_request:
              provider.id === providerId
                ? {
                    ...payload,
                    timeDistance: formatDistanceToNowStrictSimplified(
                      new Date(payload.updated_at ?? payload.created_at),
                      { addSuffix: true }
                    ),
                  }
                : provider.job_request,
          })),
        };
      });
    },
  });
}

useGetNearbyProviders.queryKey = QUERY_KEY;
