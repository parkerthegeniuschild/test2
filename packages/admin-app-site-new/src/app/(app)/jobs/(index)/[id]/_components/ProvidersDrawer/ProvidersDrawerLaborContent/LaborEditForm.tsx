import { useState } from 'react';
import { isAxiosError } from 'axios';

import {
  useGetJob,
  useGetProviderLabors,
  useGetTimezone,
  usePatchProviderLabor,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import {
  Button,
  DateTimePicker,
  ErrorMessage,
  Text,
  toast,
} from '@/components';
import { Center, Flex, styled } from '@/styled-system/jsx';

import { PlayStopIcon } from './PlayStopIcon';
import {
  curriedUtcToZonedTime,
  curriedZonedTimeToUtc,
  getTimesChecks,
  laborErrorCodeToText,
  resetSecondsAndMilliseconds,
} from './utils';

const Container = styled('div', {
  base: {
    display: 'flex',

    '& .react-date-picker__calendar': {
      transform: 'translateX(-2.25rem)',
    },
  },
});

interface LaborEditFormProps {
  timerId: number;
  initialStartDate: Date;
  initialStopDate: Date | null;
  onSuccessEdit: () => void;
  onCancel: () => void;
}

export function LaborEditForm({
  timerId,
  initialStartDate,
  initialStopDate,
  onSuccessEdit,
  onCancel,
}: LaborEditFormProps) {
  const jobId = useJobId();

  const getJob = useGetJob(jobId);
  const getProviderLabors = useGetProviderLabors({ jobId }, { enabled: false });
  const getTimezone = useGetTimezone({
    lat: getJob.data?.location_latitude ?? undefined,
    lng: getJob.data?.location_longitude ?? undefined,
  });
  const patchProviderLabor = usePatchProviderLabor({
    onSuccess() {
      toast.success('Labor updated successfully');

      onSuccessEdit();
    },
    async onAfterMutate() {
      void getJob.refetch();
      await getProviderLabors.refetch();
    },
  });

  const timezone = getTimezone.data!.tz;
  const utcToZonedTime = curriedUtcToZonedTime(timezone);
  const zonedTimeToUtc = curriedZonedTimeToUtc(timezone);

  const [startTime, setStartTime] = useState<Date | null>(
    utcToZonedTime(initialStartDate)
  );
  const [endTime, setEndTime] = useState<Date | null>(
    initialStopDate ? utcToZonedTime(initialStopDate) : null
  );

  const { isStartTimeAfterEndTime, isEndTimeOnFuture, isStartTimeOnFuture } =
    getTimesChecks(
      startTime ? zonedTimeToUtc(startTime) : null,
      endTime ? zonedTimeToUtc(endTime) : null
    );

  function handleSave() {
    const hasAnyError = [
      isStartTimeAfterEndTime,
      isStartTimeOnFuture,
      isEndTimeOnFuture,
    ].some(Boolean);

    if (hasAnyError) {
      return;
    }

    const payload = {
      start_time: startTime
        ? resetSecondsAndMilliseconds(zonedTimeToUtc(startTime)).toISOString()
        : null,
      end_time: endTime
        ? resetSecondsAndMilliseconds(zonedTimeToUtc(endTime)).toISOString()
        : null,
    };

    patchProviderLabor.mutate({ jobId, timerId, ...payload });
  }

  return (
    <>
      {!!endTime && (
        <Container>
          <Center w="2.5rem" alignItems="flex-start" pt="0.6875rem">
            <PlayStopIcon state="stop" />
          </Center>

          <Flex
            direction="column"
            gap={2}
            pr={3}
            py={3}
            flex={1}
            borderBottomWidth="1px"
            borderColor="gray.200"
          >
            <DateTimePicker
              size="sm"
              showClearButton={false}
              maxDate={utcToZonedTime(new Date().toISOString())}
              error={Boolean(isEndTimeOnFuture || isStartTimeAfterEndTime)}
              value={endTime}
              onChange={date =>
                setEndTime(
                  date ?? utcToZonedTime(initialStopDate ?? new Date())
                )
              }
            />

            {!!getTimezone.data && (
              <Text lineHeight="md">
                Timezone: {getTimezone.data.abbreviation}
              </Text>
            )}
          </Flex>
        </Container>
      )}

      <Container>
        <Center w="2.5rem" alignItems="flex-start" pt="0.6875rem">
          <PlayStopIcon state="play" />
        </Center>

        <Flex direction="column" gap={2} pr={3} py={3} flex={1}>
          <DateTimePicker
            size="sm"
            showClearButton={false}
            maxDate={utcToZonedTime(new Date().toISOString())}
            error={!!isStartTimeOnFuture}
            value={startTime}
            onChange={date =>
              setStartTime(date ?? utcToZonedTime(initialStartDate))
            }
          />

          {!!getTimezone.data && (
            <Text lineHeight="md">
              Timezone: {getTimezone.data.abbreviation}
            </Text>
          )}
        </Flex>
      </Container>

      <Flex
        direction="column"
        gap={2}
        pl={10}
        pr={3}
        mb={3}
        css={{ _empty: { display: 'none' } }}
      >
        {isStartTimeAfterEndTime && (
          <ErrorMessage>
            {laborErrorCodeToText('LABOR_END_TIME_BEFORE_START_TIME')}
          </ErrorMessage>
        )}

        {isEndTimeOnFuture && (
          <ErrorMessage>End time cannot be in the future</ErrorMessage>
        )}

        {isStartTimeOnFuture && (
          <ErrorMessage>Start time cannot be in the future</ErrorMessage>
        )}

        {patchProviderLabor.isError && (
          <ErrorMessage>
            {Boolean(
              patchProviderLabor.error &&
                !isAxiosError(patchProviderLabor.error)
            ) &&
              `Error to update labor${
                patchProviderLabor.error instanceof Error
                  ? `: ${patchProviderLabor.error.message}`
                  : ''
              }`}

            {isAxiosError(patchProviderLabor.error) &&
              (laborErrorCodeToText(
                patchProviderLabor.error.response?.data.error
              ) ??
                `Error to update labor${
                  patchProviderLabor.error instanceof Error
                    ? `: ${patchProviderLabor.error.message}`
                    : ''
                }`)}
          </ErrorMessage>
        )}
      </Flex>

      <Flex gap={2} pl={10} pb={3} position="relative" zIndex={0}>
        <Button
          size="sm"
          variant="secondary"
          disabled={patchProviderLabor.isLoading}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={patchProviderLabor.isLoading}
          loading={patchProviderLabor.isLoading}
          onClick={handleSave}
        >
          Save
        </Button>
      </Flex>
    </>
  );
}
