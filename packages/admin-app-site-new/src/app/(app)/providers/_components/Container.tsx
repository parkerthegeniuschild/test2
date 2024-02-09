'use client';

import { useQueryParam, useTablePageData } from '@/app/(app)/_hooks';
import {
  useGetProviders,
  type UseGetProvidersCountOptions,
  type UseGetProvidersOptions,
} from '@/app/(app)/providers/_api';
import { Pagination, Select, Text } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

import { INITIAL_CASH_BALANCE } from '../_constants';
import type { Provider, Status } from '../_types';

import { Filters } from './Filters';
import { Header } from './Header';
import { Table } from './Table';

type ContainerProps = {
  initialProviders?: UseGetProvidersOptions['initialData'];
  initialColumnsVisibility?: Record<string, boolean>;
  initialProvidersCount?: UseGetProvidersCountOptions['initialData'];
};

export function Container({
  initialProviders,
  initialColumnsVisibility = {},
  initialProvidersCount,
}: ContainerProps) {
  const {
    columnsVisibility,
    currentPage,
    debouncedSearch,
    handleChangeColumnVisibility,
    handleFilterChange,
    handleOrderChange,
    handlePageChange,
    handlePageSizeChange,
    order,
    pageSize,
    resetSearch,
    search,
    setSearch,
    tableRef,
  } = useTablePageData<keyof Provider>({
    columnsVisibility: {
      key: 'providers-columns',
      initialValue: initialColumnsVisibility,
    },
  });

  const [status, setStatus] = useQueryParam<Status>('status', 'approved');
  const [cashBalance, setCashBalance] = useQueryParam(
    'balance',
    INITIAL_CASH_BALANCE,
    {
      transformer: ({ operator, values }) => ({
        operator,
        values: typeof values === 'string' ? values.split(',') : values,
      }),
      skipSync: ({ values }) => values[0].length === 0,
    }
  );

  const getProviders = useGetProviders(
    {
      status,
      page: currentPage - 1,
      size: pageSize,
      order,
      ...(debouncedSearch.trim().length > 0
        ? {
            search: debouncedSearch.trim(),
          }
        : {}),
      ...(cashBalance.values[0].length > 0
        ? {
            balance: `${cashBalance.operator}:${cashBalance.values.join('+')}`,
          }
        : {}),
    },
    { initialData: initialProviders }
  );

  function handleClearFilters() {
    setCashBalance(INITIAL_CASH_BALANCE);
  }

  function handleStatusChange(newStatus: Status) {
    setStatus(newStatus);
    handleClearFilters();
    resetSearch();
  }

  return (
    <>
      <Header
        isLoading={getProviders.isFetching}
        initialProvidersCount={initialProvidersCount}
        status={status}
        onStatusChange={handleFilterChange(handleStatusChange)}
      />

      <Filters
        columnsVisibility={columnsVisibility}
        cashBalance={cashBalance}
        search={search}
        onSearchChange={handleFilterChange(setSearch)}
        onCashBalanceChange={handleFilterChange(setCashBalance)}
        onChangeColumnVisibility={handleChangeColumnVisibility}
        onClearFilters={handleFilterChange(handleClearFilters)}
        onClearSearch={resetSearch}
      />

      <Flex direction="column" gap={4} css={{ mt: 4 }}>
        <Table
          ref={tableRef}
          getProviders={getProviders}
          columnsVisibility={columnsVisibility}
          order={order}
          onHideColumn={columnId =>
            handleChangeColumnVisibility(columnId, false)
          }
          onOrderChange={handleOrderChange}
        />

        <Flex justify="space-between" align="center" css={{ px: 6, mb: 4 }}>
          {!!getProviders.data && (
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
                {getProviders.data.paginationData.number === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}
                -
                {(currentPage - 1) * pageSize +
                  getProviders.data.paginationData.number}{' '}
                of {getProviders.data.paginationData.totalElements}
              </Text>

              {getProviders.data.providers.length > 0 ? (
                <Pagination
                  totalPages={Math.ceil(
                    getProviders.data.paginationData.totalElements / pageSize
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
