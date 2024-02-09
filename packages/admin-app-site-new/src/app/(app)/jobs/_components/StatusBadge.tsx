import { match } from 'ts-pattern';

import { Badge, Icon } from '@/components';
import { css } from '@/styled-system/css';

import type { JobStatus } from '../_types';

type StatusBadgeProps = {
  status: JobStatus;
};

export function StatusBadge({
  children,
  status,
}: React.PropsWithChildren<StatusBadgeProps>) {
  return match(status)
    .with('DRAFT', () => (
      <Badge size="lg" duotone bgColor="rgba(130, 140, 153, 0.12)">
        <Icon.Draft className={css({ color: 'gray.400' })} />
        {children ?? 'Draft'}
      </Badge>
    ))
    .with('UNASSIGNED', () => (
      <Badge size="lg" duotone bgColor="rgba(130, 140, 153, 0.12)">
        <Icon.JobStatus status="Unassigned" />
        {children ?? 'Unassigned'}
      </Badge>
    ))
    .with('NOTIFYING', () => (
      <Badge size="lg" duotone bgColor="rgba(255, 175, 10, 0.12)">
        <Icon.JobStatus status="Notifying" />
        {children ?? 'Notifying'}
      </Badge>
    ))
    .with('ACCEPTED', () => (
      <Badge size="lg" duotone bgColor="rgba(28, 146, 255, 0.12)">
        <Icon.JobStatus status="On the way" />
        {children ?? 'On the way'}
      </Badge>
    ))
    .with('IN_PROGRESS', () => (
      <Badge size="lg" duotone bgColor="rgba(0, 204, 102, 0.12)">
        <Icon.JobStatus status="In progress" />
        {children ?? 'In progress'}
      </Badge>
    ))
    .with('PAUSE', () => (
      <Badge size="lg" duotone bgColor="rgba(130, 140, 153, 0.12)">
        <Icon.JobStatus status="Paused" />
        {children ?? 'Paused'}
      </Badge>
    ))
    .with('MANUAL', () => (
      <Badge size="lg" duotone bgColor="rgba(130, 140, 153, 0.12)">
        <Icon.JobStatus status="Manual" />
        {children ?? 'Manual'}
      </Badge>
    ))
    .with('COMPLETED', 'COMPLETED_PENDING_REVIEW', () => (
      <Badge size="lg" duotone bgColor="rgba(0, 204, 102, 0.12)">
        <Icon.JobStatus status="Completed" />
        {children ?? 'Completed'}
      </Badge>
    ))
    .with('CANCELED', 'CANCELED_PENDING_REVIEW', () => (
      <Badge size="lg" duotone bgColor="rgba(242, 93, 38, 0.12)">
        <Icon.JobStatus status="Canceled" />
        {children ?? 'Canceled'}
      </Badge>
    ))
    .exhaustive();
}
