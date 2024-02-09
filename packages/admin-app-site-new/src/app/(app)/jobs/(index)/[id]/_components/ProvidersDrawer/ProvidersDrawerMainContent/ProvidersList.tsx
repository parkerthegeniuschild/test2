import { useState } from 'react';

import { format } from '@/app/_utils';
import {
  type ProviderParsed,
  useCancelJobRequest,
  useCreateJobRequest,
  useGetJob,
  useGetNearbyProviders,
  useGetNearbyProvidersCount,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useJobWorkflowStatus,
  useProviderAtom,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { UnlockedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import {
  Alert,
  Badge,
  Dropdown,
  ErrorMessage,
  Spinner,
  Tabs,
  Text,
  TextButton,
  toast,
} from '@/components';
import { css } from '@/styled-system/css';
import { Box, Center, Flex } from '@/styled-system/jsx';

import { MileRadiusFilter } from './MileRadiusFilter';
import { ProviderCard } from './ProviderCard';
import { SpotlightCard } from './SpotlightCard';

interface ProviderListProps {
  enableQueries: boolean;
  onSpotlightRequest: (provider: ProviderParsed) => void;
}

export function ProvidersList({
  enableQueries,
  onSpotlightRequest,
}: ProviderListProps) {
  const jobId = useJobId();

  const jobWorkflowStatus = useJobWorkflowStatus();
  const providerAtom = useProviderAtom();

  const [notifyingProviderIdsSet, setNotifyingProviderIdsSet] = useState<
    Set<number>
  >(new Set());
  const [isMileRadiusFilterDropdownOpen, setIsMileRadiusFilterDropdownOpen] =
    useState(false);

  const getNearbyProviders = useGetNearbyProviders(
    {
      jobId,
      isOnline: providerAtom.data.selectedStatus === 'online',
      mileRadius: providerAtom.data.mileRadiusFilter,
    },
    { enabled: enableQueries }
  );
  const getNearbyProvidersCount = useGetNearbyProvidersCount(
    { jobId, mileRadius: providerAtom.data.mileRadiusFilter },
    { enabled: enableQueries }
  );

  const doesJobHaveProvider = !!useGetJob(jobId).data?.provider;

  function addProviderIdToSet(providerId: number) {
    setNotifyingProviderIdsSet(state => {
      const newState = new Set(state);
      newState.add(providerId);
      return newState;
    });
  }

  function removeProviderIdFromSet(providerId: number) {
    setNotifyingProviderIdsSet(state => {
      const newState = new Set(state);
      newState.delete(providerId);
      return newState;
    });
  }

  const createJobRequest = useCreateJobRequest({
    onMutate(variables) {
      addProviderIdToSet(variables.providerId);
    },
    onSettled(_, __, variables) {
      removeProviderIdFromSet(variables.providerId);
    },
    onSuccess(data) {
      getNearbyProviders.updateProviderJobRequest(data.provider_id, data);
    },
    onError(error) {
      toast.error(
        `Error while notifying provider${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });
  const cancelJobRequest = useCancelJobRequest({
    onMutate(variables) {
      addProviderIdToSet(variables.providerId);
    },
    onSettled(_, __, variables) {
      removeProviderIdFromSet(variables.providerId);
    },
    onSuccess(data) {
      getNearbyProviders.updateProviderJobRequest(data.provider_id, data);
    },
    onError(error) {
      toast.error(
        `Error while stop notifying provider${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  if (getNearbyProviders.error) {
    return (
      <ErrorMessage p={5}>
        Error to fetch providers
        {getNearbyProviders.error instanceof Error
          ? `: ${getNearbyProviders.error.message}`
          : ''}
      </ErrorMessage>
    );
  }

  return (
    <Flex direction="column" gap={5} px={5} pt={5} overflow="hidden" flex={1}>
      {jobWorkflowStatus === 'draft' && (
        <Alert
          title="Unable to notify providers"
          description="Complete all job steps to notify providers."
        />
      )}

      <Text as="div" size="sm" color="gray.400" display="flex">
        Providers within{' '}
        {format.number(Number(providerAtom.data.mileRadiusFilter))} mile
        radius.&nbsp;
        <Dropdown
          trigger={
            <TextButton fontSize="inherit" fontWeight="medium">
              Change
            </TextButton>
          }
          css={{ width: '16.25rem' }}
          placement="bottom"
          open={isMileRadiusFilterDropdownOpen}
          onOpenChange={setIsMileRadiusFilterDropdownOpen}
          unmountOnHide
        >
          <MileRadiusFilter
            initialValue={providerAtom.data.mileRadiusFilter}
            onApply={mileRadius => {
              providerAtom.setMileRadiusFilter(mileRadius);
              setIsMileRadiusFilterDropdownOpen(false);
            }}
          />
        </Dropdown>
      </Text>

      <Tabs
        selectedId={providerAtom.data.selectedStatus}
        setSelectedId={id =>
          providerAtom.setSelectedStatus(
            id as typeof providerAtom.data.selectedStatus
          )
        }
      >
        <Tabs.List>
          <Tabs.Tab
            id="online"
            textProps={{
              className: css({
                gap: getNearbyProvidersCount.data ? undefined : '0!',
              }),
            }}
          >
            Online
            {getNearbyProvidersCount.data ? (
              <Badge content="number" variant="primary">
                {getNearbyProvidersCount.data.online}
              </Badge>
            ) : (
              <span className={css({ h: 4 })} />
            )}
          </Tabs.Tab>
          <Tabs.Tab
            id="offline"
            textProps={{
              className: css({
                gap: getNearbyProvidersCount.data ? undefined : '0!',
              }),
            }}
          >
            Offline
            {getNearbyProvidersCount.data ? (
              <Badge content="number" duotone>
                {getNearbyProvidersCount.data.offline}
              </Badge>
            ) : (
              <span className={css({ h: 4 })} />
            )}
          </Tabs.Tab>

          {getNearbyProviders.isFetching && (
            <Box transform="translateY(calc(-1 * token(spacing.1.5)))">
              <Spinner />
            </Box>
          )}
        </Tabs.List>
      </Tabs>

      {getNearbyProviders.data?.data.length === 0 &&
        !getNearbyProviders.isPreviousData && (
          <Center flex={1}>
            <Text fontSize="md" lineHeight="lg" fontWeight="semibold">
              No providers {providerAtom.data.selectedStatus}
            </Text>
          </Center>
        )}

      {(getNearbyProviders.data?.data.length ?? 0) > 0 && (
        <div
          className={css({
            overflowY: 'auto',
            overflowX: 'hidden',
            pr: 2,
            pb: 5,
            width: 'calc(100% + token(spacing.2))',
          })}
        >
          <Flex
            direction="column"
            gap={1.5}
            transitionProperty="opacity, filter"
            transitionDuration="fast"
            transitionTimingFunction="ease-in-out"
            css={
              getNearbyProviders.isPreviousData
                ? { opacity: 0.6, filter: 'blur(1px)', pointerEvents: 'none' }
                : {}
            }
          >
            {getNearbyProviders.data?.data.map(provider => (
              <SpotlightCard
                key={provider.id}
                onSpotlight={() => onSpotlightRequest(provider)}
              >
                <ProviderCard
                  data={{
                    name: provider.name!,
                    status: provider.status,
                    distance: provider.distance,
                    rating: provider.rating,
                    rawRating: provider.rawRating,
                    phone: provider.phone ?? null,
                  }}
                  lastKnownLocation={
                    (provider.daysFromLastKnownLocation ?? 0) > 0
                      ? provider.lastKnownLocationTimeDistance
                      : null
                  }
                  status={provider.job_request?.status}
                  statusText={provider.job_request?.timeDistance}
                  supportButton={
                    !doesJobHaveProvider &&
                    !provider.is_onjob && (
                      <UnlockedOnly>
                        <TextButton
                          colorScheme="gray"
                          alignSelf="flex-start"
                          disabled={
                            jobWorkflowStatus === 'draft' ||
                            notifyingProviderIdsSet.has(provider.id)
                          }
                          whiteSpace="nowrap"
                          onClick={() =>
                            provider.job_request?.status === 'NOTIFYING'
                              ? cancelJobRequest.mutate({
                                  jobId,
                                  providerId: provider.id,
                                  jobRequestId: provider.job_request.id,
                                })
                              : createJobRequest.mutate({
                                  jobId,
                                  providerId: provider.id,
                                })
                          }
                        >
                          {notifyingProviderIdsSet.has(provider.id) && (
                            <Spinner borderColor="gray.700" />
                          )}

                          {!notifyingProviderIdsSet.has(provider.id) &&
                            (provider.job_request?.status === 'NOTIFYING'
                              ? 'Stop Notifying'
                              : 'Notify')}
                        </TextButton>
                      </UnlockedOnly>
                    )
                  }
                >
                  <ProviderCard.Footer>
                    <Flex justify="space-between" align="center">
                      <Text
                        fontWeight="medium"
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                      >
                        {provider.statusText}
                      </Text>

                      {!!provider.is_onjob && (
                        <Badge duotone size="sm">
                          1 job
                        </Badge>
                      )}
                    </Flex>
                  </ProviderCard.Footer>
                </ProviderCard>
              </SpotlightCard>
            ))}
          </Flex>
        </div>
      )}
    </Flex>
  );
}
