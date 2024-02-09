import { forwardRef } from 'react';

import type { OrderModel } from '@/app/_types/order';
import { PROVIDER } from '@/app/(app)/_constants';
import { useGetProviders } from '@/app/(app)/providers/_api';
import {
  Avatar,
  Icon,
  Table as DSTable,
  type TableElement,
} from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

import type { Provider } from '../_types';

type TableProps = {
  columnsVisibility: Record<string, boolean>;
  getProviders: ReturnType<typeof useGetProviders>;
  order: OrderModel<keyof Provider>;
  onHideColumn: (columnId: string) => void;
  onOrderChange: (
    field: keyof Provider
  ) => (newOrder: 'asc' | 'desc' | null) => void;
};

export const Table = forwardRef<TableElement, TableProps>(
  (
    { getProviders, columnsVisibility, order, onHideColumn, onOrderChange },
    forwardedRef
  ) => {
    function getColumnVisibility(columnId: string) {
      return typeof columnsVisibility[columnId] === 'boolean'
        ? columnsVisibility[columnId]
        : true;
    }

    return (
      // 14.4375rem is the sum of all the page's components' heights except the table itself
      <Box maxHeight="calc(100vh - 14.4375rem)">
        <DSTable ref={forwardedRef}>
          <DSTable.Header>
            <DSTable.Row>
              <DSTable.Head
                hideColumnDisabled
                sortOrder={order.firstname}
                onSort={onOrderChange('firstname')}
                onClearSort={() => onOrderChange('firstname')(null)}
              >
                Name
              </DSTable.Head>
              <DSTable.Head
                hideColumnDisabled
                sortOrder={order.phone}
                sortType="numeric"
                onSort={onOrderChange('phone')}
                onClearSort={() => onOrderChange('phone')(null)}
              >
                Phone Number
              </DSTable.Head>
              {/* <DSTable.Head>Pro Rewards</DSTable.Head> */}
              {getColumnVisibility('rating') && (
                <DSTable.Head
                  align="right"
                  sortOrder={order.rating}
                  sortType="numeric"
                  onSort={onOrderChange('rating')}
                  onClearSort={() => onOrderChange('rating')(null)}
                  onHideColumn={() => onHideColumn('rating')}
                >
                  Star Rating
                </DSTable.Head>
              )}
              {getColumnVisibility('onTimeArrival') && (
                <DSTable.Head
                  align="right"
                  sortDisabled
                  sortType="numeric"
                  onHideColumn={() => onHideColumn('onTimeArrival')}
                >
                  On-time Arrival
                </DSTable.Head>
              )}
              {getColumnVisibility('acceptedRate') && (
                <DSTable.Head
                  align="right"
                  sortDisabled
                  sortType="numeric"
                  onHideColumn={() => onHideColumn('acceptedRate')}
                >
                  Accept Rate
                </DSTable.Head>
              )}
              {getColumnVisibility('lastJob') && (
                <DSTable.Head
                  align="right"
                  sortDisabled
                  onHideColumn={() => onHideColumn('lastJob')}
                >
                  Last Job
                </DSTable.Head>
              )}
              <DSTable.Head align="right">Jobs</DSTable.Head>
              <DSTable.Head
                hideColumnDisabled
                align="right"
                sortType="numeric"
                sortOrder={order.balance}
                onSort={onOrderChange('balance')}
                onClearSort={() => onOrderChange('balance')(null)}
              >
                Cash Balance
              </DSTable.Head>
            </DSTable.Row>
          </DSTable.Header>

          <DSTable.Body isPreviousData={getProviders.isPreviousData}>
            {getProviders.data?.providers.map(provider => (
              <DSTable.Row key={provider.id}>
                <DSTable.Cell>
                  <Flex align="center" gap={2}>
                    <Avatar
                      name={provider.name}
                      status={provider.is_online ? 'online' : 'offline'}
                    />
                    {provider.name}
                  </Flex>
                </DSTable.Cell>
                <DSTable.Cell>{provider.formattedPhone}</DSTable.Cell>
                {/* <DSTable.Cell>
                  <Flex align="center" gap={1.5}>
                    <Icon.ProRewards.Emerald />
                    Emerald
                  </Flex>
                </DSTable.Cell> */}
                {getColumnVisibility('rating') && (
                  <DSTable.Cell textAlign="right">
                    {typeof provider.rawRating === 'number' ? (
                      <Flex
                        justify="flex-end"
                        align="center"
                        gap={1.5}
                        color={
                          provider.rawRating <
                          PROVIDER.MINIMUM_ACCEPTABLE_RATING
                            ? 'danger'
                            : undefined
                        }
                      >
                        <Icon.Star
                          className={css({
                            color:
                              provider.rawRating <
                              PROVIDER.MINIMUM_ACCEPTABLE_RATING
                                ? 'inherit'
                                : 'gray.500',
                          })}
                        />
                        {provider.rating}
                      </Flex>
                    ) : (
                      ''
                    )}
                  </DSTable.Cell>
                )}
                {getColumnVisibility('onTimeArrival') && (
                  <DSTable.Cell textAlign="right">
                    {/* <Flex justify="flex-end" align="center" gap={1.5}>
                  <Icon.Hourglass className={css({ color: 'gray.500' })} />
                  90%
                </Flex> */}
                  </DSTable.Cell>
                )}
                {getColumnVisibility('acceptedRate') && (
                  <DSTable.Cell textAlign="right">
                    {typeof provider.acceptedRate === 'number' ? (
                      <Flex
                        justify="flex-end"
                        align="center"
                        gap={1.5}
                        color={
                          provider.acceptedRate < 80 ? 'danger' : undefined
                        }
                      >
                        <Icon.CheckCircleBroken
                          className={css({
                            color:
                              provider.acceptedRate < 80
                                ? 'inherit'
                                : 'gray.500',
                          })}
                        />
                        {provider.acceptedRate}%
                      </Flex>
                    ) : (
                      ''
                    )}
                  </DSTable.Cell>
                )}
                {getColumnVisibility('lastJob') && (
                  <DSTable.Cell textAlign="right" />
                )}
                <DSTable.Cell textAlign="right">
                  {provider.completedJobsCount}
                </DSTable.Cell>
                <DSTable.Cell
                  textAlign="right"
                  color={provider.rawBalance < 0 ? 'danger' : undefined}
                >
                  {provider.balance}
                </DSTable.Cell>
              </DSTable.Row>
            ))}

            {!getProviders.data && getProviders.isError && (
              <DSTable.Row>
                <DSTable.Cell colSpan={9} textAlign="center">
                  Some error occurred while fetching providers
                  {getProviders.error instanceof Error &&
                    `: ${getProviders.error.message}`}
                </DSTable.Cell>
              </DSTable.Row>
            )}

            {getProviders.data?.providers.length === 0 && (
              <DSTable.Row>
                <DSTable.Cell colSpan={9} textAlign="center">
                  No providers found. Try changing filters.
                </DSTable.Cell>
              </DSTable.Row>
            )}
          </DSTable.Body>
        </DSTable>
      </Box>
    );
  }
);

Table.displayName = 'Table';
