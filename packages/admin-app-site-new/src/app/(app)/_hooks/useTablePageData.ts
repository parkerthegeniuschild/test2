import { useRef } from 'react';

import type { OrderModel } from '@/app/_types/order';
import type { TableElement } from '@/components';

import { usePageSize } from './usePageSize';
import { useQueryParam, useQueryParamDebounced } from './useQueryParam';
import { useServerCookie } from './useServerCookie';

type UseTablePageDataConfig<TOrderKeys extends string> = {
  columnsVisibility: {
    key: string;
    initialValue: Record<string, boolean>;
  };
  order?: { initialValue: OrderModel<TOrderKeys> };
};

export function useTablePageData<TOrderKeys extends string>(
  config: UseTablePageDataConfig<TOrderKeys>
) {
  const [pageSize, setPageSize] = usePageSize();

  const [currentPage, setCurrentPage] = useQueryParam('page', 1);
  const [order, setOrder] = useQueryParam<OrderModel<TOrderKeys>>(
    'order',
    config.order?.initialValue ?? {}
  );
  const [search, setSearch, debouncedSearch, resetSearch] =
    useQueryParamDebounced('search', '', {
      skipSync: value => value.trim().length === 0,
    });

  const [columnsVisibility, setColumnsVisibility] = useServerCookie(
    config.columnsVisibility.key,
    config.columnsVisibility.initialValue
  );

  const tableRef = useRef<TableElement>(null);

  function resetCurrentPage() {
    setCurrentPage(1);
  }

  function scrollTableToTop() {
    tableRef.current?.scrollToTop();
  }

  function handlePageChange(newPage: number) {
    scrollTableToTop();
    setCurrentPage(newPage);
  }

  function handlePageSizeChange(newPageSize: string) {
    setPageSize(Number(newPageSize));
    resetCurrentPage();
  }

  function handleOrderChange(field: TOrderKeys) {
    return (newOrder: 'asc' | 'desc' | null) => {
      scrollTableToTop();
      setOrder(state => {
        const newState = { ...state };

        if (newOrder === newState[field] || newOrder === null) {
          const initialOrderValue = config.order?.initialValue[field];

          if (initialOrderValue && initialOrderValue !== 'none') {
            newState[field] = 'none';
          } else {
            delete newState[field];
          }
        } else {
          newState[field] = newOrder;
        }

        return newState;
      });
    };
  }

  function handleChangeColumnVisibility(columnId: string, visible: boolean) {
    setColumnsVisibility(state => ({
      ...state,
      [columnId]: visible,
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleFilterChange<T extends (...args: any[]) => any>(fn: T) {
    return (...params: Parameters<T>) => {
      scrollTableToTop();
      resetCurrentPage();
      fn(...params);
    };
  }

  return {
    tableRef,
    pageSize,
    currentPage,
    search,
    debouncedSearch,
    order,
    columnsVisibility,
    scrollTableToTop,
    resetCurrentPage,
    resetSearch,
    handleFilterChange,
    setSearch,
    handleChangeColumnVisibility,
    handleOrderChange,
    handlePageSizeChange,
    handlePageChange,
  };
}
