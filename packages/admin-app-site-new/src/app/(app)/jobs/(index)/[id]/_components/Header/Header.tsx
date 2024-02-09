import { useState } from 'react';
import { useDebounce } from 'react-use';

import { ClientOnly } from '@/app/_components';
import { PROVIDER } from '@/app/(app)/_constants';
import { PendingReviewAlert, StatusBadge } from '@/app/(app)/jobs/_components';
import { S } from '@/app/(app)/jobs/(index)/_components';
import {
  useGetJob,
  useGetProviderLabors,
  useGetTimezone,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { useMapAtom } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { usePatchJobRequestChangeListener } from '@/app/(app)/jobs/(index)/[id]/_events';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import type { Coordinate } from '@/app/(app)/jobs/(index)/[id]/_types';
import {
  Avatar,
  Heading,
  Icon,
  Spinner,
  Text,
  toast,
  UserCard,
} from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

import { DraftOnly } from '../DraftOnly';
import { PublishedOnly } from '../PublishedOnly';

import { ActionsDropdown } from './ActionsDropdown';
import { LeavePageSection } from './LeavePageSection';

export function Header() {
  const jobId = useJobId();

  const getJob = useGetJob(jobId);

  const shouldShowTimerData = !['DRAFT', 'UNASSIGNED', 'NOTIFYING'].includes(
    getJob.data?.status_id ?? ''
  );

  const getProviderLabors = useGetProviderLabors(
    { jobId },
    { enabled: shouldShowTimerData }
  );

  const mapAtom = useMapAtom();

  const [jobLocationCoords, setJobLocationCoords] = useState<Coordinate | null>(
    () =>
      mapAtom.data.jobMarkerLocation?.latitude &&
      mapAtom.data.jobMarkerLocation.longitude
        ? {
            latitude: mapAtom.data.jobMarkerLocation.latitude,
            longitude: mapAtom.data.jobMarkerLocation.longitude,
          }
        : null
  );
  const [isUpdatingJob, setIsUpdatingJob] = useState(false);

  useDebounce(
    () => {
      if (
        mapAtom.data.jobMarkerLocation?.latitude &&
        mapAtom.data.jobMarkerLocation.longitude
      ) {
        setJobLocationCoords({
          latitude: mapAtom.data.jobMarkerLocation.latitude,
          longitude: mapAtom.data.jobMarkerLocation.longitude,
        });
      }
    },
    500,
    [
      mapAtom.data.jobMarkerLocation?.latitude,
      mapAtom.data.jobMarkerLocation?.longitude,
    ]
  );

  usePatchJobRequestChangeListener(({ status, error }) => {
    setIsUpdatingJob(status === 'pending');

    if (status === 'error') {
      toast.error(
        `Error while updating job${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    }
  });

  const getTimeZone = useGetTimezone({
    lat: jobLocationCoords?.latitude,
    lng: jobLocationCoords?.longitude,
  });

  return (
    <S.Header.Container>
      <S.Header.LeftBar>
        <Heading
          variant="subheading"
          display="flex"
          alignItems="center"
          gap={3}
        >
          Job #{jobId} {(getJob.isFetching || isUpdatingJob) && <Spinner />}
        </Heading>

        <S.Header.LeftBarEndContainer>
          <PublishedOnly>
            {getJob.data && (
              <Flex align="center" gap={3}>
                <Flex align="center" gap={2}>
                  {getJob.data.status_id.includes('PENDING_REVIEW') && (
                    <PendingReviewAlert />
                  )}
                  <StatusBadge status={getJob.data.status_id} />
                </Flex>

                {!!getProviderLabors.data && (
                  <>
                    <Box w="1px" h={4} bgColor="gray.300" />
                    <Flex align="center" gap={1.5}>
                      {['ACCEPTED', 'PAUSE', 'IN_PROGRESS'].includes(
                        getJob.data.status_id
                      ) &&
                        (getProviderLabors.data.isInProgress ? (
                          <Icon.Play className={css({ fontSize: '2xs.xl' })} />
                        ) : (
                          <Icon.Pause />
                        ))}
                      <Text fontWeight="medium">
                        {getProviderLabors.data.formattedWorkedTime}
                      </Text>
                    </Flex>
                  </>
                )}

                {shouldShowTimerData && !getProviderLabors.data && (
                  <Box w="4rem" />
                )}
              </Flex>
            )}
          </PublishedOnly>

          <DraftOnly>
            <StatusBadge status="DRAFT">
              {isUpdatingJob ? 'Saving Draft...' : 'Draft saved'}
            </StatusBadge>
          </DraftOnly>

          {!getJob.data?.provider && <S.Header.DashedCircle />}

          {!!getJob.data?.provider && (
            <UserCard
              size="lg"
              trigger={
                <Box>
                  <Avatar
                    name={getJob.data.provider.name}
                    status={getJob.data.provider.status}
                    initialsProps={{
                      className: css({ transform: 'translateY(1px)' }),
                    }}
                  />
                </Box>
              }
            >
              <UserCard.Header>
                <UserCard.Name>{getJob.data.provider.name}</UserCard.Name>
                <UserCard.Role userRole="provider" />
                <UserCard.Stats
                  stats={{
                    starRating: {
                      value: getJob.data.provider.rating ?? '-',
                      poor:
                        getJob.data.provider.rawRating <
                        PROVIDER.MINIMUM_ACCEPTABLE_RATING,
                    },
                    acceptRate: { value: '-' },
                    onTimeArrival: { value: '-' },
                  }}
                />
              </UserCard.Header>

              <UserCard.Item>
                <UserCard.Status status={getJob.data.provider.status} />
              </UserCard.Item>

              {!!getJob.data.provider.phone && (
                <UserCard.Item>
                  <UserCard.Phone withSMS={false}>
                    {getJob.data.provider.phone}
                  </UserCard.Phone>
                </UserCard.Item>
              )}
            </UserCard>
          )}
        </S.Header.LeftBarEndContainer>
      </S.Header.LeftBar>

      <Flex
        flex={1}
        px={6}
        align="center"
        gap={1.75}
        opacity={getTimeZone.isPreviousData ? 0.6 : undefined}
        css={{
          transitionProperty: 'opacity',
          transitionDuration: 'fast',
          transitionTimingFunction: 'ease-in-out',
        }}
      >
        <ClientOnly>
          {getTimeZone.data && (
            <Text fontWeight="medium">
              It&apos;s currently{' '}
              <Text as="span" fontWeight="semibold" color="gray.900">
                {new Intl.DateTimeFormat('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  timeZone: getTimeZone.data.tz,
                  timeZoneName: 'short',
                }).format(new Date())}
              </Text>{' '}
              at this job
            </Text>
          )}
        </ClientOnly>

        <PublishedOnly>
          <Flex ml="auto" align="center" gap={6}>
            {getJob.data && (
              <ActionsDropdown jobStatus={getJob.data.status_id} />
            )}
            <LeavePageSection />
          </Flex>
        </PublishedOnly>
      </Flex>
    </S.Header.Container>
  );
}
