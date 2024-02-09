import { useState } from 'react';

import { useGetJob } from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useMapAtom,
  useProviderAtom,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { UnlockedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Badge, Button, Text, TextButton } from '@/components';
import { css } from '@/styled-system/css';
import { Box, Center, Flex, styled } from '@/styled-system/jsx';
import { center } from '@/styled-system/patterns';

import { ConfirmProviderRemovalModal } from './ConfirmProviderRemovalModal';
import { ProviderCard } from './ProviderCard';
import { ProvidersList } from './ProvidersList';
import { SpotlightCard } from './SpotlightCard';

const ProviderEmptyBox = styled('div', {
  base: {
    bgColor: 'rgba(1, 2, 3, 0.04)',
    rounded: 'lg',
    p: 3,
    textAlign: 'center',
    fontSize: 'sm',
    lineHeight: 1,
    fontWeight: 'semibold',
  },
});

interface ProvidersDrawerMainContentProps {
  showProvidersList: boolean;
  enableQueries: boolean;
  onShowProvidersList: () => void;
  onSelectProvider: (providerId: number) => void;
}

export function ProvidersDrawerMainContent({
  showProvidersList,
  enableQueries,
  onShowProvidersList,
  onSelectProvider,
}: ProvidersDrawerMainContentProps) {
  const jobId = useJobId();

  const getJob = useGetJob(jobId);

  const providerAtom = useProviderAtom();
  const mapAtom = useMapAtom();

  const [isProviderRemovalModalOpen, setIsProviderRemovalModalOpen] =
    useState(false);

  function handleProviderSpotlight(provider: {
    id: number;
    latitude?: number;
    longitude?: number;
  }) {
    if (
      typeof provider.latitude === 'number' &&
      typeof provider.longitude === 'number'
    ) {
      mapAtom.navigateToLocation({
        latitude: provider.latitude,
        longitude: provider.longitude,
        showJobMarkerHint: false,
        mutateJobMarker: false,
      });
      providerAtom.highlightProvider(provider.id);
    }
  }

  return (
    <>
      <Flex
        direction="column"
        p={5}
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <Flex justify="space-between" align="center">
          <Text
            fontWeight="semibold"
            color="gray.900"
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            On this job
            <span className={center({ h: 3.5 })}>
              <Badge
                content="number"
                variant={getJob.data?.provider ? 'primary' : 'danger'}
              >
                {getJob.data?.provider ? 1 : 0}
              </Badge>
            </span>
          </Text>

          {/* <TextButton colorScheme="gray" rightSlot={<Icon.Edit />}>
            1 provider
          </TextButton> */}
        </Flex>

        {!getJob.data?.provider && (
          <Flex direction="column" justify="center" gap={3} h="11.875rem">
            <Flex direction="column" align="center" gap={1}>
              <Text fontSize="md" lineHeight="lg" fontWeight="semibold">
                No providers assigned
              </Text>
              <Text lineHeight="md" color="gray.400">
                Notify providers to fill these open job posts.
              </Text>
            </Flex>

            <ProviderEmptyBox>Provider 1 is empty</ProviderEmptyBox>
          </Flex>
        )}

        {!!getJob.data?.provider && (
          <Box mt={5}>
            <SpotlightCard
              className={css({ cursor: 'pointer' })}
              onClick={() => onSelectProvider(getJob.data!.provider!.id)}
              onSpotlight={() =>
                handleProviderSpotlight({
                  ...getJob.data?.provider?.position?.location,
                  id: getJob.data!.provider!.id,
                })
              }
            >
              <ProviderCard
                data={{
                  distance: getJob.data.provider.distance,
                  name: getJob.data.provider.name!,
                  phone: getJob.data.provider.formattedPhone!,
                  rating: getJob.data.provider.rating,
                  rawRating: getJob.data.provider.rawRating,
                  status: getJob.data.provider.status,
                }}
                lastKnownLocation={
                  (getJob.data.provider.daysFromLastKnownLocation ?? 0) > 0
                    ? getJob.data.provider.lastKnownLocationTimeDistance
                    : null
                }
                supportButton={
                  <UnlockedOnly>
                    <TextButton
                      colorScheme="gray"
                      alignSelf="flex-start"
                      whiteSpace="nowrap"
                      onClick={() => setIsProviderRemovalModalOpen(true)}
                    >
                      Remove
                    </TextButton>
                  </UnlockedOnly>
                }
              />
            </SpotlightCard>
          </Box>
        )}
      </Flex>

      <UnlockedOnly>
        {showProvidersList && (
          <ProvidersList
            enableQueries={enableQueries}
            onSpotlightRequest={handleProviderSpotlight}
          />
        )}

        {!showProvidersList && (
          <Center p={5} flex={1} gap={3} flexDir="column">
            <Flex direction="column" gap={1} textAlign="center">
              <Text fontWeight="semibold" fontSize="md" lineHeight="lg">
                All job posts filled
              </Text>
              <Text lineHeight="md" color="gray.400">
                Providers not on this job are hidden.
              </Text>
            </Flex>

            <Button
              variant="secondary"
              isolation="isolate"
              onClick={onShowProvidersList}
            >
              Show nearby providers
            </Button>
          </Center>
        )}
      </UnlockedOnly>

      {!!getJob.data?.provider && (
        <ConfirmProviderRemovalModal
          open={isProviderRemovalModalOpen}
          provider={{
            id: getJob.data.provider.id,
            name: getJob.data.provider.name!,
          }}
          onClose={() => setIsProviderRemovalModalOpen(false)}
          onSuccessfulRemoval={() => {
            setIsProviderRemovalModalOpen(false);
            onShowProvidersList();
          }}
        />
      )}
    </>
  );
}
