import { forwardRef } from 'react';

import { OrderModel } from '@/app/_types/order';
import { PROVIDER } from '@/app/(app)/_constants';
import { useRouter } from '@/app/(app)/_hooks';
import { PendingReviewAlert, StatusBadge } from '@/app/(app)/jobs/_components';
import {
  Avatar,
  AvatarGroup,
  Icon,
  Table as DSTable,
  type TableElement,
  Text,
  Tooltip,
  UserCard,
} from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

import type { useGetJobs } from '../_api/useGetJobs';
import type { Job } from '../_types';

type TableProps = {
  getJobs: ReturnType<typeof useGetJobs>;
  columnsVisibility: Record<string, boolean>;
  order: OrderModel<keyof Job>;
  onHideColumn: (columnId: string) => void;
  onOrderChange: (
    field: keyof Job
  ) => (newOrder: 'asc' | 'desc' | null) => void;
};

export const Table = forwardRef<TableElement, TableProps>(
  (
    { getJobs, columnsVisibility, order, onHideColumn, onOrderChange },
    forwardedRef
  ) => {
    const router = useRouter();

    function getColumnVisibility(columnId: string) {
      return typeof columnsVisibility[columnId] === 'boolean'
        ? columnsVisibility[columnId]
        : true;
    }

    function navigateToJobDetails(jobId: Job['id']) {
      router.refresh();
      router.push(`/jobs/${jobId}`);
    }

    function handleClickRow(jobId: Job['id']) {
      return (e: React.UIEvent) => {
        const isTargetRowChild = e.currentTarget.contains(e.target as Node);

        if (!isTargetRowChild) {
          return;
        }

        const rowElement = e.currentTarget;
        const clickedElement = e.target as HTMLElement;
        const parentClickableElement = clickedElement.closest('[tabindex]');

        const hasClickedOnAnInsideButton =
          rowElement !== parentClickableElement;

        if (hasClickedOnAnInsideButton) {
          return;
        }

        navigateToJobDetails(jobId);
      };
    }

    return (
      <Box maxHeight="calc(100vh - 14.4375rem)">
        <DSTable ref={forwardedRef}>
          <DSTable.Header>
            <DSTable.Row>
              <DSTable.Head
                sortType="numeric"
                hideColumnDisabled
                sortOrder={order.id}
                onSort={onOrderChange('id')}
                onClearSort={() => onOrderChange('id')(null)}
              >
                Job #
              </DSTable.Head>
              <DSTable.Head
                hideColumnDisabled
                sortOrder={order.status_id}
                onSort={onOrderChange('status_id')}
                onClearSort={() => onOrderChange('status_id')(null)}
              >
                Status
              </DSTable.Head>
              <DSTable.Head>Company</DSTable.Head>
              <DSTable.Head>Contacts</DSTable.Head>
              <DSTable.Head>Provider</DSTable.Head>
              {getColumnVisibility('service') && (
                <DSTable.Head
                  sortDisabled
                  onHideColumn={() => onHideColumn('service')}
                >
                  Service
                </DSTable.Head>
              )}
              {getColumnVisibility('serviceArea') && (
                <DSTable.Head
                  sortDisabled
                  onHideColumn={() => onHideColumn('serviceArea')}
                >
                  Service Area
                </DSTable.Head>
              )}
              {getColumnVisibility('duration') && (
                <DSTable.Head
                  align="right"
                  sortType="numeric"
                  sortDisabled
                  onHideColumn={() => onHideColumn('duration')}
                >
                  Duration
                </DSTable.Head>
              )}
              {getColumnVisibility('price') && (
                <DSTable.Head
                  align="right"
                  sortType="numeric"
                  sortOrder={order.total_cost}
                  onSort={onOrderChange('total_cost')}
                  onClearSort={() => onOrderChange('total_cost')(null)}
                  onHideColumn={() => onHideColumn('price')}
                >
                  Price
                </DSTable.Head>
              )}
              <DSTable.Head
                align="right"
                sortType="numeric"
                hideColumnDisabled
                sortOrder={order.created_at}
                onSort={onOrderChange('created_at')}
                onClearSort={() => onOrderChange('created_at')(null)}
              >
                Created
              </DSTable.Head>
            </DSTable.Row>
          </DSTable.Header>

          <DSTable.Body isPreviousData={getJobs.isPreviousData}>
            {getJobs.data?.jobs.map(job => (
              <DSTable.Row
                key={job.id}
                tabIndex={0}
                cursor="pointer"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleClickRow(job.id)(e);
                  }
                }}
                onClick={handleClickRow(job.id)}
              >
                <DSTable.Cell>{job.id}</DSTable.Cell>
                <DSTable.Cell>
                  <Flex align="center" gap={1}>
                    <StatusBadge status={job.status} />

                    {job.isAbandoned && (
                      <Tooltip
                        description={
                          <Flex direction="column" gap={1}>
                            <Text color="gray.50" fontWeight="semibold">
                              Draft abandoned
                            </Text>
                            {!!job.reason && (
                              <Text
                                fontWeight="normal"
                                fontSize="xs"
                                lineHeight="1.0625rem"
                                color="gray.100"
                              >
                                {job.reason}
                              </Text>
                            )}
                          </Flex>
                        }
                        showArrow
                        placement="bottom"
                        role="tooltip"
                        variant="popover"
                        className={css({
                          cursor: 'help!',
                          ml: 1,
                          color: 'gray.400',
                        })}
                        gutter={1}
                      >
                        <Icon.ClipboardX />
                      </Tooltip>
                    )}

                    {job.isPendingReview && (
                      <Box ml={1}>
                        <PendingReviewAlert />
                      </Box>
                    )}
                  </Flex>
                </DSTable.Cell>
                <DSTable.Cell>{job.company ?? ''}</DSTable.Cell>
                <DSTable.Cell>
                  <AvatarGroup max={3}>
                    {job.dispatcher ? (
                      <UserCard
                        trigger={
                          <Avatar
                            name={job.dispatcher.name}
                            userRole="dispatcher"
                          />
                        }
                      >
                        <UserCard.Header>
                          <UserCard.Name>{job.dispatcher.name}</UserCard.Name>
                          <UserCard.Role userRole="dispatcher" />
                        </UserCard.Header>

                        {!!job.dispatcher.formattedPhone && (
                          <UserCard.Item>
                            <UserCard.Phone
                              disableSMS={job.dispatcher.disableSMS}
                            >
                              {job.dispatcher.formattedPhone}
                            </UserCard.Phone>

                            {!!job.dispatcher.formattedSecondaryPhone && (
                              <UserCard.Phone
                                disableSMS={job.dispatcher.disableSMS}
                              >
                                {job.dispatcher.formattedSecondaryPhone}
                              </UserCard.Phone>
                            )}
                          </UserCard.Item>
                        )}
                      </UserCard>
                    ) : null}

                    {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
                    <>
                      {(job.drivers?.length ?? 0) > 0
                        ? job.drivers!.map(driver => (
                            <UserCard
                              key={driver.id}
                              trigger={
                                <Avatar name={driver.name} userRole="driver" />
                              }
                            >
                              <UserCard.Header>
                                <UserCard.Name>{driver.name}</UserCard.Name>
                                <UserCard.Role userRole="driver" />
                              </UserCard.Header>

                              {!!driver.formattedPhone && (
                                <UserCard.Item>
                                  <UserCard.Phone
                                    disableSMS={driver.disableSMS}
                                  >
                                    {driver.formattedPhone}
                                  </UserCard.Phone>

                                  {!!driver.formattedSecondaryPhone && (
                                    <UserCard.Phone
                                      disableSMS={driver.disableSMS}
                                    >
                                      {driver.formattedSecondaryPhone}
                                    </UserCard.Phone>
                                  )}
                                </UserCard.Item>
                              )}
                            </UserCard>
                          ))
                        : null}
                    </>
                  </AvatarGroup>
                </DSTable.Cell>
                <DSTable.Cell>
                  {job.provider ? (
                    <Flex align="center" gap={2}>
                      <UserCard
                        size="lg"
                        trigger={
                          <Avatar
                            name={job.provider.name}
                            status={job.provider.status}
                          />
                        }
                      >
                        <UserCard.Header>
                          <UserCard.Name>{job.provider.name}</UserCard.Name>
                          <UserCard.Role userRole="provider" />

                          <UserCard.Stats
                            stats={{
                              starRating: {
                                value: job.provider.rating ?? '-',
                                poor:
                                  job.provider.rawRating <
                                  PROVIDER.MINIMUM_ACCEPTABLE_RATING,
                              },
                              acceptRate: { value: '-' },
                              onTimeArrival: { value: '-' },
                            }}
                          />
                        </UserCard.Header>

                        <UserCard.Item>
                          <UserCard.Status status={job.provider.status} />
                        </UserCard.Item>

                        <UserCard.Item>
                          <UserCard.Phone withSMS={false}>
                            {job.provider.formattedPhone}
                          </UserCard.Phone>
                        </UserCard.Item>
                      </UserCard>
                      {job.provider.name}
                    </Flex>
                  ) : (
                    ''
                  )}
                </DSTable.Cell>
                {getColumnVisibility('service') && <DSTable.Cell />}
                {getColumnVisibility('serviceArea') && (
                  <DSTable.Cell>{job.serviceArea}</DSTable.Cell>
                )}
                {getColumnVisibility('duration') && (
                  <DSTable.Cell textAlign="right">
                    {job.duration ? (
                      <Flex
                        justify="flex-end"
                        align="center"
                        gap={1.5}
                        color="gray.500"
                      >
                        {job.status === 'PAUSE' ? (
                          <Icon.Pause />
                        ) : (
                          <Icon.Play className={css({ fontSize: '2xs.xl' })} />
                        )}
                        {job.duration}
                      </Flex>
                    ) : null}
                  </DSTable.Cell>
                )}
                {getColumnVisibility('price') && (
                  <DSTable.Cell
                    textAlign="right"
                    color={job.rawPrice < 0 ? 'danger' : undefined}
                  >
                    {job.price}
                  </DSTable.Cell>
                )}
                <DSTable.Cell textAlign="right">{job.createdAt}</DSTable.Cell>
              </DSTable.Row>
            ))}

            {!getJobs.data && getJobs.isError && (
              <DSTable.Row>
                <DSTable.Cell colSpan={10} textAlign="center">
                  Some error occurred while fetching jobs
                  {getJobs.error instanceof Error &&
                    `: ${getJobs.error.message}`}
                </DSTable.Cell>
              </DSTable.Row>
            )}

            {getJobs.data?.jobs.length === 0 && (
              <DSTable.Row>
                <DSTable.Cell colSpan={10} textAlign="center">
                  No jobs found. Try changing filters.
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
