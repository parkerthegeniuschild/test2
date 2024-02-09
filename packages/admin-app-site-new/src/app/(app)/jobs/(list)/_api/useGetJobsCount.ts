import { useQuery } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { PaginationModel } from '@/app/_types/api';
import { format } from '@/app/_utils';

import { parseFiltersToAPIStatuses, TAB_TO_STATUSES } from '../_utils';

type GetJobsAPIResponse = {
  page: PaginationModel;
};

async function getJobsCount() {
  const [allResponse, openResponse, closedResponse, unpaidResponse] =
    await Promise.all([
      api.get<GetJobsAPIResponse>('jobs', {
        params: {
          size: 1,
          status_id: `inArray:${parseFiltersToAPIStatuses({
            pendingReview: TAB_TO_STATUSES.all.pendingReview,
            statuses: [...TAB_TO_STATUSES.all.statuses],
          }).join('+')}`,
        },
      }),
      api.get<GetJobsAPIResponse>('jobs', {
        params: {
          size: 1,
          status_id: `inArray:${parseFiltersToAPIStatuses({
            pendingReview: TAB_TO_STATUSES.open.pendingReview,
            statuses: [...TAB_TO_STATUSES.open.statuses],
          }).join('+')}`,
        },
      }),
      api.get<GetJobsAPIResponse>('jobs', {
        params: {
          size: 1,
          status_id: `inArray:${parseFiltersToAPIStatuses({
            pendingReview: TAB_TO_STATUSES.closed.pendingReview,
            statuses: [...TAB_TO_STATUSES.closed.statuses],
          }).join('+')}`,
        },
      }),
      api.get<GetJobsAPIResponse>('jobs', {
        params: {
          size: 1,
          status_id: `inArray:${parseFiltersToAPIStatuses({
            pendingReview: TAB_TO_STATUSES.unpaid.pendingReview,
            statuses: [...TAB_TO_STATUSES.unpaid.statuses],
          }).join('+')}`,
          total_cost: 'gt:payment_sum',
        },
      }),
    ]);

  return {
    all: format.number(allResponse.data.page.totalElements),
    open: format.number(openResponse.data.page.totalElements),
    closed: format.number(closedResponse.data.page.totalElements),
    unpaid: format.number(unpaidResponse.data.page.totalElements),
  };
}

export type UseGetJobsCountOptions = {
  initialData?: Awaited<ReturnType<typeof getJobsCount>>;
};

export function useGetJobsCount(options: UseGetJobsCountOptions = {}) {
  return useQuery({
    queryKey: ['useGetJobsCount'],
    queryFn: getJobsCount,
    cacheTime: Infinity,
    ...options,
  });
}

useGetJobsCount.queryFn = getJobsCount;
