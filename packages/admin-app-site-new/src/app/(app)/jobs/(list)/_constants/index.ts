import type { OrderModel } from '@/app/_types/order';

import type { Job, JobStatusFilter, PendingReviewState } from '../_types';

export const DEFAULT_PENDING_REVIEW: PendingReviewState = 'yes';

export const DEFAULT_STATUSES: JobStatusFilter[] = [
  'ACCEPTED',
  'CANCELED',
  'COMPLETED',
  'DRAFT',
  'IN_PROGRESS',
  'MANUAL',
  'NOTIFYING',
  'PAUSE',
  'UNASSIGNED',
];

export const DEFAULT_SORTS: OrderModel<keyof Job> = {
  created_at: 'desc',
};
