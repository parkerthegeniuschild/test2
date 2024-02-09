import {
  decodeQueryParams,
  DelimitedArrayParam,
  NumberParam,
  ObjectParam,
  StringParam,
} from '@/app/_lib/serializeQueryParams';
import { DEFAULT_PAGE_SIZE } from '@/app/(app)/_constants';
import { fetchOnServerGuard } from '@/app/(app)/_utils/fetchOnServerGuard';

import {
  DEFAULT_PENDING_REVIEW,
  DEFAULT_SORTS,
  DEFAULT_STATUSES,
} from '../_constants';
import { type JobStatusFilter, pendingReviewStateSchema } from '../_types';

import { useGetJobs } from './useGetJobs';
import { useGetJobsCount } from './useGetJobsCount';

type PrefetchJobsParams = {
  searchParams: Record<string, string>;
};

export async function prefetchJobs({ searchParams }: PrefetchJobsParams) {
  let jobs;
  let jobsCount;

  const { cookies } = await fetchOnServerGuard(searchParams, async () => {
    const { tab, statuses, pr, page, size, order } = decodeQueryParams(
      {
        tab: StringParam,
        statuses: DelimitedArrayParam,
        pr: StringParam,
        page: NumberParam,
        size: NumberParam,
        order: ObjectParam,
      },
      searchParams
    );

    const parsedPendingReview = pendingReviewStateSchema.safeParse(pr);

    try {
      [jobs, jobsCount] = await Promise.all([
        useGetJobs.queryFn({
          page: page ? page - 1 : 0,
          size: size ?? DEFAULT_PAGE_SIZE,
          order: { ...DEFAULT_SORTS, ...order },
          tab: tab === 'unpaid' ? 'unpaid' : null,
          pendingReview: parsedPendingReview.success
            ? parsedPendingReview.data
            : DEFAULT_PENDING_REVIEW,
          statuses: (statuses as JobStatusFilter[]) ?? DEFAULT_STATUSES,
        }),
        useGetJobsCount.queryFn(),
      ]);
    } catch (err) {
      console.error('Error fetching jobs', err);
    }
  });

  const jobsColumns = cookies.get('jobs-columns')?.value;

  return {
    jobs,
    jobsCount,
    jobsColumns: jobsColumns
      ? (JSON.parse(jobsColumns) as Record<string, boolean>)
      : {},
  };
}
