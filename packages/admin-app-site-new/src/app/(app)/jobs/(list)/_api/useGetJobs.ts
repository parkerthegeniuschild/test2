import { useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { PaginationModel } from '@/app/_types/api';
import type { OrderModel } from '@/app/_types/order';
import { format } from '@/app/_utils';
import {
  mountOrderObject,
  mountPersonObject,
  providerFlagsToStatus,
} from '@/app/(app)/_utils';

import type { Job, JobStatusFilter, PendingReviewState } from '../_types';
import { parseFiltersToAPIStatuses } from '../_utils';

type GetJobsAPIResponse = {
  jobs: Job[];
  page: PaginationModel;
};

export type GetJobsParams = {
  statuses: JobStatusFilter[];
  pendingReview: PendingReviewState;
  size: number;
  page: number;
  tab?: 'unpaid' | null;
  order?: OrderModel<keyof Job> | null;
};

async function getJobs({
  statuses,
  pendingReview,
  tab,
  order,
  ...params
}: GetJobsParams) {
  const parsedStatuses = parseFiltersToAPIStatuses({ pendingReview, statuses });

  const response = await api.get<GetJobsAPIResponse>('jobs', {
    params: {
      joins: [
        'company',
        'driver',
        'dispatcher',
        'provider',
        'jobRequest',
        'jobLeaveReason',
        'jobDrivers',
      ].join(','),
      ...(parsedStatuses.length > 0
        ? { status_id: `inArray:${parsedStatuses.join('+')}` }
        : {}),
      ...(tab === 'unpaid' ? { total_cost: 'gt:payment_sum' } : {}),
      ...mountOrderObject(order),
      ...params,
    },
  });

  return {
    paginationData: response.data.page,
    jobs: response.data.jobs.map(job => ({
      id: job.id,
      status: job.status_id,
      isPendingReview: job.status_id.includes('PENDING_REVIEW'),
      company: job.company?.name ?? null,
      createdAt: format.date(new Date(job.created_at)),
      isAbandoned: !!job.is_abandoned,
      reason:
        job.jobLeaveReason?.length > 0
          ? job.jobLeaveReason.at(-1)?.reason
          : null,
      service: null,
      serviceArea:
        [job.location_city, job.location_state].filter(Boolean).join(', ') ??
        '',
      price: format.currency(
        Number.parseFloat(job.total_cost) - Number.parseFloat(job.payment_sum)
      ),
      rawPrice:
        Number.parseFloat(job.total_cost) - Number.parseFloat(job.payment_sum),
      duration: null,
      dispatcher: mountPersonObject(job.dispatcher),
      drivers:
        job.jobDrivers?.map(driver => ({
          id: driver.id,
          ...mountPersonObject(driver),
        })) ?? null,
      provider: job.provider
        ? {
            rating:
              typeof job.provider.rating === 'number'
                ? job.provider.rating.toFixed(1)
                : null,
            rawRating: job.provider.rating,
            status: providerFlagsToStatus(job.provider).status,
            ...mountPersonObject(job.provider),
          }
        : null,
    })),
  };
}

type GetJobsParsedResponse = Awaited<ReturnType<typeof getJobs>>;
export type JobParsed = GetJobsParsedResponse['jobs'][number];

const QUERY_KEY = 'useGetJobs';

export type UseGetJobsOptions = {
  initialData?: GetJobsParsedResponse;
};

export function useGetJobs(
  params: GetJobsParams,
  { initialData }: UseGetJobsOptions = {}
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getJobs(params),
    refetchInterval: 30 * 1000, // 30 seconds
    initialData: () => {
      const isFirstCache =
        queryClient.getQueriesData({ queryKey: [QUERY_KEY] }).length === 0;

      return isFirstCache ? initialData : undefined;
    },
  });

  return Object.assign(query, {
    updateData(payload: Partial<GetJobsParsedResponse>) {
      queryClient.setQueryData([QUERY_KEY, params], oldData => {
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

useGetJobs.queryKey = QUERY_KEY;
useGetJobs.queryFn = getJobs;
