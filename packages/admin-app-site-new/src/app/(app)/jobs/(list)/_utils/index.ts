import { match } from 'ts-pattern';

import type { JobStatus } from '@/app/(app)/jobs/_types';

import type { JobStatusFilter, PendingReviewState } from '../_types';

export function statusToText(status: JobStatus) {
  return match(status)
    .with('DRAFT', () => 'Draft' as const)
    .with('UNASSIGNED', () => 'Unassigned' as const)
    .with('NOTIFYING', () => 'Notifying' as const)
    .with('ACCEPTED', () => 'On the way' as const)
    .with('MANUAL', () => 'Manual' as const)
    .with('PAUSE', () => 'Paused' as const)
    .with('IN_PROGRESS', () => 'In progress' as const)
    .with('CANCELED', 'CANCELED_PENDING_REVIEW', () => 'Canceled' as const)
    .with('COMPLETED', 'COMPLETED_PENDING_REVIEW', () => 'Completed' as const)
    .exhaustive();
}

export function parseFiltersToAPIStatuses({
  pendingReview,
  statuses,
}: {
  pendingReview: PendingReviewState;
  statuses: JobStatusFilter[];
}) {
  return match(pendingReview)
    .returnType<JobStatus[]>()
    .with('no', () => statuses)
    .with('yes', () =>
      statuses.map(status => {
        if (status === 'COMPLETED') {
          return 'COMPLETED_PENDING_REVIEW';
        }

        if (status === 'CANCELED') {
          return 'CANCELED_PENDING_REVIEW';
        }

        return status;
      })
    )
    .with('all', () => {
      const _statuses: JobStatus[] = [...statuses];

      if (_statuses.includes('COMPLETED')) {
        _statuses.push('COMPLETED_PENDING_REVIEW');
      }

      if (_statuses.includes('CANCELED')) {
        _statuses.push('CANCELED_PENDING_REVIEW');
      }

      return _statuses;
    })
    .exhaustive();
}

export const TAB_TO_STATUSES = {
  all: {
    pendingReview: 'all',
    statuses: [
      'ACCEPTED',
      'CANCELED',
      'COMPLETED',
      'DRAFT',
      'IN_PROGRESS',
      'MANUAL',
      'NOTIFYING',
      'PAUSE',
      'UNASSIGNED',
    ],
  },
  open: {
    pendingReview: 'yes',
    statuses: [
      'ACCEPTED',
      'CANCELED',
      'COMPLETED',
      'DRAFT',
      'IN_PROGRESS',
      'MANUAL',
      'NOTIFYING',
      'PAUSE',
      'UNASSIGNED',
    ],
  },
  closed: {
    pendingReview: 'no',
    statuses: ['CANCELED', 'COMPLETED'],
  },
  unpaid: {
    pendingReview: 'all',
    statuses: ['COMPLETED'],
    tab: 'unpaid',
  },
} as const;
