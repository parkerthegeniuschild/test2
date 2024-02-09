import { useState } from 'react';
import { isAxiosError } from 'axios';
import { match } from 'ts-pattern';

import {
  useGetJob,
  useGetProviderLabors,
  useGetServiceTypes,
  useGetTimezone,
  usePostProviderLabor,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import {
  Button,
  DateTimePicker,
  ErrorMessage,
  Icon,
  Label,
  Select,
  Text,
  TextButton,
  toast,
} from '@/components';
import { css } from '@/styled-system/css';
import { Center, Flex } from '@/styled-system/jsx';

import { PlayStopIcon } from './PlayStopIcon';
import {
  curriedUtcToZonedTime,
  curriedZonedTimeToUtc,
  getTimesChecks,
  laborErrorCodeToText,
  resetSecondsAndMilliseconds,
} from './utils';

interface LaborCreateFormProps {
  onSuccessCreate: () => void;
  onCancel?: () => void;
}

export function LaborCreateForm({
  onSuccessCreate,
  onCancel,
}: LaborCreateFormProps) {
  const jobId = useJobId();

  const getJob = useGetJob(jobId);
  const getServiceTypes = useGetServiceTypes();
  const getProviderLabors = useGetProviderLabors({ jobId }, { enabled: false });
  const getTimezone = useGetTimezone({
    lat: getJob.data?.location_latitude ?? undefined,
    lng: getJob.data?.location_longitude ?? undefined,
  });
  const postProviderLabor = usePostProviderLabor({
    onSuccess() {
      toast.success('Labor created successfully');

      onSuccessCreate();
    },
    async onAfterMutate() {
      void getJob.refetch();
      await getProviderLabors.refetch();
    },
  });

  const timezone = getTimezone.data!.tz;
  const utcToZonedTime = curriedUtcToZonedTime(timezone);
  const zonedTimeToUtc = curriedZonedTimeToUtc(timezone);

  const [vehicle, setVehicle] = useState('');
  const [service, setService] = useState('');

  const [hasEndTime, setHasEndTime] = useState(false);

  const [startTime, setStartTime] = useState(
    resetSecondsAndMilliseconds(utcToZonedTime(new Date()))
  );
  const [endTime, setEndTime] = useState<Date | null>(new Date());

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const isVehicleEmpty = vehicle === '';
  const isServiceEmpty = service === '';
  const { isStartTimeAfterEndTime, isEndTimeOnFuture, isStartTimeOnFuture } =
    getTimesChecks(
      zonedTimeToUtc(startTime),
      endTime ? zonedTimeToUtc(endTime) : null
    );

  function handleAddEndTime() {
    setHasEndTime(true);
    setEndTime(resetSecondsAndMilliseconds(utcToZonedTime(new Date())));
  }

  function handleAddLabor() {
    setIsFormSubmitted(true);

    const hasAnyError = [
      isVehicleEmpty,
      isServiceEmpty,
      hasEndTime && isStartTimeAfterEndTime,
      hasEndTime && isEndTimeOnFuture,
      isStartTimeOnFuture,
    ].some(Boolean);

    if (hasAnyError) {
      return;
    }

    const payload = {
      start_time: resetSecondsAndMilliseconds(
        zonedTimeToUtc(startTime)
      ).toISOString(),
      end_time:
        endTime && hasEndTime
          ? resetSecondsAndMilliseconds(zonedTimeToUtc(endTime)).toISOString()
          : null,
    };

    postProviderLabor.mutate({
      jobId,
      service_id:
        service === 'waiting_time' ? null : Number.parseInt(service, 10),
      provider_id: getJob.data!.provider!.id,
      ...payload,
    });
  }

  return (
    <Flex direction="column" gap={5} zIndex={0}>
      <Flex direction="column" gap={2}>
        <Label as="p" required color="gray.600">
          Select vehicle
        </Label>
        <Select
          placeholder="Select vehicle"
          activeText={match(vehicle)
            .with('no_vehicle', () => 'No vehicle')
            .with('', () => null)
            .otherwise(
              () =>
                `Vehicle ${
                  (getJob.data?.jobVehicles.findIndex(
                    _vehicle => _vehicle.id.toString() === vehicle
                  ) ?? 0) + 1
                }`
            )}
          error={isFormSubmitted && isVehicleEmpty}
          value={vehicle}
          onChange={(v: string) => {
            if (v === 'no_vehicle') {
              setService('waiting_time');
            } else {
              setService('');
            }

            setVehicle(v);
          }}
        >
          <Select.Item value="no_vehicle">No vehicle</Select.Item>
          {getJob.data?.jobVehicles.map((_vehicle, index) => (
            <Select.Item key={_vehicle.id} value={_vehicle.id.toString()}>
              Vehicle {index + 1}
            </Select.Item>
          ))}
        </Select>
        <Flex align="center" gap={3} pl={1}>
          <Center w={4} h={4}>
            <Icon.CornerDownRight
              className={css({ flexShrink: 0, fontSize: 'lg' })}
            />
          </Center>
          <Select
            placeholder="Select service"
            disabled={vehicle === 'no_vehicle' || !vehicle}
            activeText={match(service)
              .with('waiting_time', () => 'Waiting time')
              .with('', () => null)
              .otherwise(
                () =>
                  getServiceTypes.data?.[
                    getJob.data?.jobVehicles
                      .find(_vehicle => _vehicle.id.toString() === vehicle)
                      ?.jobServices.find(
                        _service => _service.id.toString() === service
                      )?.service_id ?? -1
                  ]?.name
              )}
            error={isFormSubmitted && isServiceEmpty}
            value={service}
            onChange={(v: string) => setService(v)}
          >
            {getJob.data?.jobVehicles
              .find(_vehicle => _vehicle.id.toString() === vehicle)
              ?.jobServices.map(_service => (
                <Select.Item key={_service.id} value={_service.id.toString()}>
                  {getServiceTypes.data?.[_service.service_id ?? -1]?.name}
                </Select.Item>
              ))}
          </Select>
        </Flex>
      </Flex>

      {hasEndTime && (
        <Flex gap={3}>
          <Center w={5} h={3.5}>
            <PlayStopIcon state="stop" />
          </Center>

          <Flex direction="column" gap={2} flex={1}>
            <Flex align="self" justify="space-between">
              <Label color="gray.600">End time</Label>

              <TextButton
                colorScheme="danger"
                onClick={() => setHasEndTime(false)}
              >
                Remove
              </TextButton>
            </Flex>
            <DateTimePicker
              showClearButton={false}
              maxDate={utcToZonedTime(new Date().toISOString())}
              error={
                isFormSubmitted &&
                Boolean(isEndTimeOnFuture || isStartTimeAfterEndTime)
              }
              value={endTime}
              onChange={date => setEndTime(date ?? utcToZonedTime(new Date()))}
            />
            {!!getTimezone.data && (
              <Text lineHeight="md">
                Timezone: {getTimezone.data.abbreviation}
              </Text>
            )}
          </Flex>
        </Flex>
      )}

      <Flex gap={3}>
        <Center w={5} h={3.5}>
          <PlayStopIcon state="play" />
        </Center>

        <Flex direction="column" gap={2}>
          <Label required color="gray.600">
            Start time
          </Label>
          <DateTimePicker
            showClearButton={false}
            maxDate={utcToZonedTime(new Date().toISOString())}
            error={isFormSubmitted && !!isStartTimeOnFuture}
            value={startTime}
            onChange={date => setStartTime(date ?? utcToZonedTime(new Date()))}
          />
          {!!getTimezone.data && (
            <Text lineHeight="md">
              Timezone: {getTimezone.data.abbreviation}
            </Text>
          )}
        </Flex>
      </Flex>

      {!hasEndTime && (
        <TextButton
          colorScheme="gray"
          leftSlot={<Icon.Plus />}
          ml="auto"
          onClick={handleAddEndTime}
        >
          Add end time
        </TextButton>
      )}

      <Flex
        direction="column"
        align="flex-end"
        gap={2}
        css={{ _empty: { display: 'none' } }}
      >
        {isFormSubmitted && (
          <>
            {isVehicleEmpty && (
              <ErrorMessage>Vehicle cannot be empty</ErrorMessage>
            )}

            {isServiceEmpty && (
              <ErrorMessage>Service cannot be empty</ErrorMessage>
            )}

            {hasEndTime && isStartTimeAfterEndTime && (
              <ErrorMessage>
                {laborErrorCodeToText('LABOR_END_TIME_BEFORE_START_TIME')}
              </ErrorMessage>
            )}

            {hasEndTime && isEndTimeOnFuture && (
              <ErrorMessage>End time cannot be in the future</ErrorMessage>
            )}

            {isStartTimeOnFuture && (
              <ErrorMessage>Start time cannot be in the future</ErrorMessage>
            )}
          </>
        )}

        {postProviderLabor.isError && (
          <ErrorMessage>
            {Boolean(
              postProviderLabor.error && !isAxiosError(postProviderLabor.error)
            ) &&
              `Error to create labor${
                postProviderLabor.error instanceof Error
                  ? `: ${postProviderLabor.error.message}`
                  : ''
              }`}

            {isAxiosError(postProviderLabor.error) &&
              (laborErrorCodeToText(
                postProviderLabor.error.response?.data.error
              ) ??
                `Error to create labor${
                  postProviderLabor.error instanceof Error
                    ? `: ${postProviderLabor.error.message}`
                    : ''
                }`)}
          </ErrorMessage>
        )}
      </Flex>

      <Flex gap={3} justify="flex-end">
        <Button
          size="sm"
          variant="secondary"
          disabled={postProviderLabor.isLoading}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={postProviderLabor.isLoading}
          loading={postProviderLabor.isLoading}
          onClick={handleAddLabor}
        >
          Add labor
        </Button>
      </Flex>
    </Flex>
  );
}
