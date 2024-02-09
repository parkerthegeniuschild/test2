import Link from 'next/link';
import { match } from 'ts-pattern';

import { Badge, Button, Heading, Spinner, Tabs } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import {
  useGetJobsCount,
  type UseGetJobsCountOptions,
} from '../_api/useGetJobsCount';
import type { JobStatusFilter, PendingReviewState, TabState } from '../_types';
import { TAB_TO_STATUSES } from '../_utils';

type TabId = keyof typeof TAB_TO_STATUSES;

type HeaderProps = {
  initialJobsCount?: UseGetJobsCountOptions['initialData'];
  isLoading: boolean;
  statuses: JobStatusFilter[];
  pendingReview: PendingReviewState;
  tab: TabState;
  onTabChange: (payload: {
    statuses: JobStatusFilter[];
    pendingReview: PendingReviewState;
    tab: TabState;
  }) => void;
};

export function Header({
  initialJobsCount,
  isLoading,
  statuses,
  pendingReview,
  tab,
  onTabChange,
}: HeaderProps) {
  const getJobsCount = useGetJobsCount({ initialData: initialJobsCount });

  const activeTabId = match({ statuses, pendingReview, tab })
    .with(TAB_TO_STATUSES.all, () => 'all')
    .with(TAB_TO_STATUSES.open, () => 'open')
    .with(TAB_TO_STATUSES.closed, () => 'closed')
    .with(TAB_TO_STATUSES.unpaid, () => 'unpaid')
    .otherwise(() => 'none');

  function handleTabChange(id: string | null | undefined) {
    if (id && TAB_TO_STATUSES[id as TabId]) {
      const metadata = TAB_TO_STATUSES[id as TabId];

      onTabChange({
        pendingReview: metadata.pendingReview,
        statuses: [...metadata.statuses],
        tab: id === 'unpaid' ? 'unpaid' : null,
      });
    }
  }

  return (
    <>
      <header>
        <Flex justify="space-between" align="center" css={{ px: 6, pt: 4.5 }}>
          <Heading css={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            Jobs
            {isLoading && <Spinner as="span" aria-label="Loading" />}
          </Heading>

          <Flex gap={3}>
            <Button size="sm" render={<Link href="/jobs/create" />}>
              Create Job
            </Button>
          </Flex>
        </Flex>
      </header>

      <Tabs selectedId={activeTabId} setSelectedId={handleTabChange}>
        <Tabs.List bordered className={css({ px: 6, mt: 7, mb: 4 })}>
          <Tabs.Tab id="all">
            All
            {getJobsCount.isSuccess && (
              <Badge content="number" size="md">
                {getJobsCount.data.all}
              </Badge>
            )}
          </Tabs.Tab>
          <Tabs.Tab id="open">
            Open
            {getJobsCount.isSuccess && (
              <Badge content="number" duotone size="md">
                {getJobsCount.data.open}
              </Badge>
            )}
          </Tabs.Tab>
          <Tabs.Tab id="closed">
            Closed
            {getJobsCount.isSuccess && (
              <Badge content="number" variant="primary" size="md">
                {getJobsCount.data.closed}
              </Badge>
            )}
          </Tabs.Tab>
          <Tabs.Tab id="unpaid">
            Unpaid
            {getJobsCount.isSuccess && (
              <Badge content="number" variant="danger" size="md">
                {getJobsCount.data.unpaid}
              </Badge>
            )}
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </>
  );
}
