import { useState } from 'react';

import {
  useGetJob,
  useGetProviderLabors,
  useGetServiceTypes,
  useGetTimezone,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { UnlockedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import {
  Badge,
  ErrorMessage,
  Heading,
  Icon,
  Spinner,
  Text,
  TextButton,
  Transition,
} from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

import { Earnings } from './Earnings';
import { LaborCard } from './LaborCard';
import { LaborCreateForm } from './LaborCreateForm';
import type { EarningsFocusedSection } from './types';

interface ProvidersDrawerLaborContentProps {
  enableQueries: boolean;
  onBack: () => void;
}

export function ProvidersDrawerLaborContent({
  enableQueries,
  onBack,
}: ProvidersDrawerLaborContentProps) {
  const jobId = useJobId();

  const getJob = useGetJob(jobId);
  const getTimezone = useGetTimezone({
    lat: getJob.data?.location_latitude ?? undefined,
    lng: getJob.data?.location_longitude ?? undefined,
  });
  const getServiceTypes = useGetServiceTypes();
  const getProviderLabors = useGetProviderLabors(
    { jobId },
    { enabled: enableQueries }
  );

  const [isOnCreateMode, setIsOnCreateMode] = useState(false);
  const [isEarningsOpen, setIsEarningsOpen] = useState(false);
  const [earningsFocusedSection, setEarningsFocusedSection] =
    useState<EarningsFocusedSection | null>(null);

  function handleCloseEarnings() {
    setIsEarningsOpen(false);
    setEarningsFocusedSection(null);
  }

  return (
    <>
      <Flex
        direction="column"
        gap={4}
        p={5}
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <TextButton
          colorScheme="gray"
          maxW="max"
          leftSlot={
            <Icon.ArrowUp className={css({ transform: 'rotate(-90deg)' })} />
          }
          onClick={onBack}
        >
          Back
        </TextButton>

        <Flex direction="column" gap={2.3}>
          <Flex align="center" gap={3}>
            <Heading
              as="h2"
              display="flex"
              alignItems="center"
              gap={1.5}
              color="gray.700"
              fontSize="md"
              fontWeight="semibold"
            >
              {getJob.data?.provider?.name}’s labor
              {getProviderLabors.data && (
                <Badge content="number" duotone>
                  {getProviderLabors.data.labors.length}
                </Badge>
              )}
            </Heading>

            {getProviderLabors.isFetching && <Spinner />}
          </Flex>

          <Text size="sm">
            All times are shown in the job&apos;s timezone
            {!!getTimezone.data && ` (${getTimezone.data.abbreviation})`}.
          </Text>
        </Flex>
      </Flex>

      <Flex direction="column" gap={5} p={5} overflow="auto" flex={1}>
        {isOnCreateMode ? (
          <LaborCreateForm
            onSuccessCreate={() => setIsOnCreateMode(false)}
            onCancel={() => setIsOnCreateMode(false)}
          />
        ) : (
          <>
            {getProviderLabors.isError && !getProviderLabors.data && (
              <ErrorMessage>
                Error to fetch provider labors
                {getProviderLabors.error instanceof Error
                  ? `: ${getProviderLabors.error.message}`
                  : ''}
              </ErrorMessage>
            )}

            {getProviderLabors.data && (
              <Flex
                justify="space-between"
                align="center"
                h="2.125rem"
                px={3}
                bgColor="rgba(1, 2, 3, 0.04)"
                rounded="lg"
                borderWidth="1px"
                borderColor="gray.400"
                flexShrink={0}
              >
                <Text fontWeight="medium">Total work hours:</Text>
                <Text fontWeight="semibold" color="gray.700">
                  {getProviderLabors.data.formattedWorkedTime}
                </Text>
              </Flex>
            )}

            <Flex
              direction="column"
              gap={2}
              css={{ _empty: { display: 'none' } }}
            >
              {getTimezone.data &&
                getProviderLabors.data?.labors.map(labor => {
                  const vehicleIndex =
                    getJob.data?.jobVehicles.findIndex(
                      v => v.id === labor.vehicle_id
                    ) ?? -1;
                  const vehicle = getJob.data?.jobVehicles[vehicleIndex];
                  const service = vehicle?.jobServices.find(
                    s => s.id === labor.service_id
                  );

                  return (
                    <LaborCard
                      key={labor.timers[0].id}
                      labor={labor}
                      vehicleIndex={
                        vehicleIndex !== -1 ? vehicleIndex + 1 : undefined
                      }
                      serviceName={
                        getServiceTypes.data?.[service?.service_id ?? -1]
                          ?.name ?? ''
                      }
                    />
                  );
                })}
            </Flex>

            {getTimezone.data && getProviderLabors.data && (
              <UnlockedOnly>
                <TextButton
                  leftSlot={<Icon.Plus />}
                  ml="auto"
                  onClick={() => {
                    setIsOnCreateMode(true);
                    handleCloseEarnings();
                  }}
                >
                  Add labor
                </TextButton>
              </UnlockedOnly>
            )}
          </>
        )}
      </Flex>

      {!!getJob.data?.provider && (
        <Box mt="auto" p={5} borderTopWidth="1px" borderColor="gray.100">
          <Transition.Collapse
            placement="top"
            px={1}
            mx={-1}
            open={isEarningsOpen}
            onOpenChange={setIsEarningsOpen}
            trigger={
              <TextButton
                maxW="max"
                colorScheme={isEarningsOpen ? 'gray' : 'primary'}
                rightSlot={
                  isEarningsOpen ? (
                    <Icon.Times className={css({ fontSize: '1.1875rem' })} />
                  ) : (
                    <Icon.ChevronDown
                      className={css({
                        fontSize: '1.1875rem',
                        transform: 'rotate(180deg)',
                      })}
                    />
                  )
                }
                disabled={isOnCreateMode || !!earningsFocusedSection}
              >
                {isEarningsOpen ? 'Close earnings' : 'Earnings'}
              </TextButton>
            }
          >
            <Earnings
              providerId={getJob.data.provider.id}
              focusedSection={earningsFocusedSection}
              onFocusedSectionChange={setEarningsFocusedSection}
            />
          </Transition.Collapse>
        </Box>
      )}
    </>
  );
}
