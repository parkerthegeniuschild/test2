'use client';

import { useEffect } from 'react';

import { useQueryParam, useTablePageData } from '@/app/(app)/_hooks';
import { Pagination, Select, Text } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import { useGetJobs, type UseGetJobsOptions } from '../_api/useGetJobs';
import type { UseGetJobsCountOptions } from '../_api/useGetJobsCount';
import {
  DEFAULT_PENDING_REVIEW,
  DEFAULT_SORTS,
  DEFAULT_STATUSES,
} from '../_constants';
import type {
  Job,
  JobStatusFilter,
  PendingReviewState,
  TabState,
} from '../_types';

import { Filters } from './Filters';
import { Header } from './Header';
import { Table } from './Table';

type ContainerProps = {
  initialJobs?: UseGetJobsOptions['initialData'];
  initialColumnsVisibility?: Record<string, boolean>;
  initialJobsCount?: UseGetJobsCountOptions['initialData'];
};

export function Container({
  initialJobs,
  initialColumnsVisibility = {},
  initialJobsCount,
}: ContainerProps) {
  const {
    columnsVisibility,
    currentPage,
    handleChangeColumnVisibility,
    handleFilterChange,
    handleOrderChange,
    handlePageChange,
    handlePageSizeChange,
    order,
    pageSize,
    tableRef,
  } = useTablePageData<keyof Job>({
    columnsVisibility: {
      key: 'jobs-columns',
      initialValue: initialColumnsVisibility,
    },
    order: { initialValue: DEFAULT_SORTS },
  });

  const [tab, setTab] = useQueryParam<TabState>('tab', null, {
    param: 'string',
  });
  const [statuses, setStatuses] = useQueryParam<JobStatusFilter[]>(
    'statuses',
    DEFAULT_STATUSES
  );
  const [pendingReview, setPendingReview] = useQueryParam<PendingReviewState>(
    'pr',
    DEFAULT_PENDING_REVIEW
  );

  const getJobs = useGetJobs(
    {
      statuses,
      pendingReview,
      tab,
      page: currentPage - 1,
      size: pageSize,
      order,
    },
    { initialData: initialJobs }
  );

  useEffect(() => {
    if (initialJobs && !!getJobs.data) {
      getJobs.updateData(initialJobs);
    }

    void getJobs.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTabChange(payload: {
    statuses: JobStatusFilter[];
    pendingReview: PendingReviewState;
    tab: TabState;
  }) {
    setStatuses(payload.statuses);
    setPendingReview(payload.pendingReview);
    setTab(payload.tab);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleStatusRelatedFilterChange<T extends (...args: any[]) => any>(
    fn: T
  ) {
    return (...params: Parameters<T>) => {
      handleFilterChange(fn)(...params);
      setTab(null);
    };
  }

  function handleClearFilters() {
    setStatuses([]);
    setPendingReview('all');
  }

  return (
    <>
      <Header
        initialJobsCount={initialJobsCount}
        isLoading={getJobs.isFetching}
        statuses={statuses}
        pendingReview={pendingReview}
        tab={tab}
        onTabChange={handleFilterChange(handleTabChange)}
      />

      <Filters
        columnsVisibility={columnsVisibility}
        statuses={statuses}
        pendingReview={pendingReview}
        onChangeColumnVisibility={handleChangeColumnVisibility}
        onChangeStatuses={handleStatusRelatedFilterChange(setStatuses)}
        onChangePendingReview={handleStatusRelatedFilterChange(
          setPendingReview
        )}
        onClearFilters={handleStatusRelatedFilterChange(handleClearFilters)}
      />

      <Flex direction="column" gap={4} mt={4}>
        <Table
          ref={tableRef}
          getJobs={getJobs}
          columnsVisibility={columnsVisibility}
          order={order}
          onHideColumn={columnId =>
            handleChangeColumnVisibility(columnId, false)
          }
          onOrderChange={handleOrderChange}
        />

        <Flex justify="space-between" align="center" px={6} mb={4}>
          {!!getJobs.data && (
            <>
              <Flex direction="row-reverse" align="center" gap={3}>
                <Select
                  size="xs"
                  className={css({ flex: 1 })}
                  sameWidth={false}
                  value={String(pageSize)}
                  onChange={handlePageSizeChange}
                  label={
                    <Text as="span" size="sm" fontWeight="normal">
                      Entries per page
                    </Text>
                  }
                  labelProps={{ className: css({ m: '0!', fontSize: 'xs!' }) }}
                >
                  <Select.Item value="15" />
                  <Select.Item value="25" />
                  <Select.Item value="50" />
                  <Select.Item value="100" />
                </Select>
              </Flex>

              <Text size="sm">
                {getJobs.data.paginationData.number === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}
                -
                {(currentPage - 1) * pageSize +
                  getJobs.data.paginationData.number}{' '}
                of {getJobs.data.paginationData.totalElements}
              </Text>

              {getJobs.data.jobs.length > 0 ? (
                <Pagination
                  totalPages={Math.ceil(
                    getJobs.data.paginationData.totalElements / pageSize
                  )}
                  currentPage={currentPage}
                  onChange={handlePageChange}
                />
              ) : (
                <span />
              )}
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
}
