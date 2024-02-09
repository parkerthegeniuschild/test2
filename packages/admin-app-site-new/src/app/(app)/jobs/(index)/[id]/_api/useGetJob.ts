import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { differenceInDays, formatDistanceToNow } from 'date-fns';

import { api } from '@/app/_services/api';
import { format } from '@/app/_utils';
import { mountPersonObject, providerFlagsToStatus } from '@/app/(app)/_utils';

import type { Job } from '../_types';

type GetJobAPIResponse = Job;

async function getJob(id: string) {
  const response = await api.get<GetJobAPIResponse>(`jobs/${id}`);

  const providerLocationTimestamp =
    response.data.provider?.position?.updated_at ??
    response.data.provider?.position?.created_at;

  return {
    ...response.data,
    jobVehicles: response.data.jobVehicles
      ? response.data.jobVehicles
          .sort((a, b) => a.id - b.id)
          .map(vehicle => ({
            ...vehicle,
            jobServices: vehicle.jobServices
              ? vehicle.jobServices
                  .sort((a, b) => a.id - b.id)
                  .map(service => ({
                    ...service,
                    jobServiceParts: service.jobServiceParts
                      ? service.jobServiceParts.sort((a, b) => a.id - b.id)
                      : [],
                  }))
              : [],
          }))
      : [],
    dispatcher: {
      ...response.data.dispatcher,
      ...mountPersonObject(response.data.dispatcher),
    },
    provider: response.data.provider
      ? {
          ...response.data.provider,
          status: providerFlagsToStatus(response.data.provider).status,
          rating:
            typeof response.data.provider.rating === 'number'
              ? response.data.provider.rating.toFixed(1)
              : null,
          rawRating: response.data.provider.rating,
          distance: response.data.provider.position?.distance.toFixed(2),
          daysFromLastKnownLocation: providerLocationTimestamp
            ? differenceInDays(new Date(), new Date(providerLocationTimestamp))
            : null,
          lastKnownLocationTimeDistance: providerLocationTimestamp
            ? formatDistanceToNow(new Date(providerLocationTimestamp), {
                addSuffix: true,
              })
            : null,
          ...mountPersonObject(response.data.provider),
        }
      : null,
    jobDrivers: response.data.jobDrivers.map(driver => ({
      ...driver,
      ...mountPersonObject(driver),
    })),
    company: response.data.company
      ? {
          ...response.data.company,
          type: format.string.capitalize(response.data.company.type),
          addressText: [
            response.data.company.address1,
            response.data.company.address2,
            response.data.company.city,
            response.data.company.state,
            response.data.company.zipcode,
            response.data.company.country,
          ]
            .filter(t => t?.trim())
            .filter(Boolean)
            .join(', '),
        }
      : null,
  };
}

export type JobParsed = Awaited<ReturnType<typeof getJob>>;

type UseGetJobParams = {
  initialData?: JobParsed;
  enabled?: boolean;
};

const QUERY_KEY = 'useGetJob';

export function useGetJob(
  id: string,
  { initialData, enabled }: UseGetJobParams = {}
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getJob(id),
    initialData,
    enabled,
    refetchInterval: 30 * 1000, // 30 seconds
    retry(failureCount, error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return false;
      }

      return failureCount < 3;
    },
  });

  return Object.assign(query, {
    removeQueries() {
      queryClient.removeQueries({ queryKey: [QUERY_KEY, id] });
    },
    getData() {
      return queryClient.getQueryData([QUERY_KEY, id]) as JobParsed | undefined;
    },
    updateData(payload: Partial<JobParsed>) {
      queryClient.setQueryData([QUERY_KEY, id], oldData => {
        if (!oldData) {
          return payload;
        }

        return {
          ...oldData,
          ...payload,
        };
      });
    },
  });
}

useGetJob.queryFn = getJob;
