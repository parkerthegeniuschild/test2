import { useState } from 'react';
import * as Ariakit from '@ariakit/react';

import { addSeconds, differenceInSeconds } from '@/app/_lib/dateFns';
import {
  type LaborParsed,
  useGetJob,
  useGetProviderLabors,
  usePatchProviderLabor,
  usePatchVehicleService,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  UnlockedOnly,
  useIsJobUnlocked,
} from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { emitPatchJobRequestChange } from '@/app/(app)/jobs/(index)/[id]/_events';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { ButtonGroup, Icon, IconButton, Text, toast } from '@/components';
import { css } from '@/styled-system/css';
import { styled } from '@/styled-system/jsx';

import { ConfirmLaborRemovalModal } from './ConfirmLaborRemovalModal';
import { LaborEditForm } from './LaborEditForm';
import { LaborEntry } from './LaborEntry';
import { LaborStopwatch } from './LaborStopwatch';

const Container = styled(Ariakit.Focusable, {
  base: {
    bgColor: 'white',
    rounded: 'lg',
    borderWidth: '1px',
    borderColor: 'gray.200',
    shadow: 'sm',
    position: 'relative',

    _after: {
      content: '""',
      position: 'absolute',
      height: '100%',
      width: '100%',
      pointerEvents: 'none',
      shadow: 'inset',
      left: 0,
      bottom: '-1px',
      rounded: 'calc(token(radii.lg) - 1px)',
    },

    '&[data-job-unlocked]': {
      '& .labor-block-button-group, & .labor-block-duration, & .labor-entry-timer':
        {
          transitionProperty: 'opacity, visibility',
          transitionDuration: 'fast',
          transitionTimingFunction: 'easeInOut',
        },

      '& .labor-block-button-group': {
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
      },

      '&:is(:hover, :focus-within, [data-focus-visible])': {
        '& .labor-block-button-group': {
          opacity: 1,
          visibility: 'visible',
          pointerEvents: 'auto',
        },

        '& .labor-block-duration, & .labor-entry-timer': {
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
        },
      },
    },
  },
  variants: {
    inProgress: {
      true: {
        borderColor: 'primary',
      },
    },
  },
});

interface LaborBlockProps {
  timeWorked?: string;
  startTime: string;
  endTime: string | null;
  labor: LaborParsed;
  timerId: number;
  laborTitle: string;
}

export function LaborBlock({
  timeWorked,
  startTime,
  endTime,
  labor,
  timerId,
  laborTitle,
}: LaborBlockProps) {
  const jobId = useJobId();

  const isJobUnlocked = useIsJobUnlocked();

  const getJob = useGetJob(jobId);
  const getProviderLabors = useGetProviderLabors({ jobId }, { enabled: false });
  const patchProviderLabor = usePatchProviderLabor({
    async onAfterMutate() {
      void getJob.refetch();
      await getProviderLabors.refetch();
    },
    onSuccess() {
      toast.success('Labor stopped successfully');
    },
    onError(error) {
      emitPatchJobRequestChange({ status: 'error', error });
    },
  });
  const patchVehicleService = usePatchVehicleService(
    {
      jobId,
      id: labor.service_id ?? -1,
      vehicleId: labor.vehicle_id ?? -1,
    },
    {
      async onAfterMutate() {
        void getJob.refetch();
        await getProviderLabors.refetch();
      },
      onSuccess() {
        toast.success('Labor stopped successfully');
      },
    }
  );

  const [isOnEditMode, setIsOnEditMode] = useState(false);
  const [isLaborRemovalModalOpen, setIsLaborRemovalModalOpen] = useState(false);

  const inProgress = endTime === null;

  function handlePauseStopwatch() {
    const isGhostTimer = !labor.service_id;

    if (isGhostTimer) {
      patchProviderLabor.mutate({
        jobId,
        timerId,
        end_time: new Date().toISOString(),
      });
      return;
    }

    patchVehicleService.mutate({ status: 'PAUSED' });
  }

  return (
    <>
      <Container
        inProgress={inProgress}
        data-job-unlocked={isJobUnlocked ? true : undefined}
      >
        {inProgress && !isOnEditMode && (
          <LaborEntry timeType="start" timestamp={startTime}>
            <LaborStopwatch
              key={`${startTime}${patchVehicleService.isLoading}${patchProviderLabor.isLoading}`}
              autoStart={
                !patchVehicleService.isLoading && !patchProviderLabor.isLoading
              }
              offsetTimestamp={addSeconds(
                new Date(),
                differenceInSeconds(new Date(), new Date(startTime))
              )}
              loading={
                patchVehicleService.isLoading || patchProviderLabor.isLoading
              }
              onMinutesChange={getProviderLabors.refetch}
              onStop={handlePauseStopwatch}
            />
          </LaborEntry>
        )}

        {isOnEditMode && (
          <LaborEditForm
            timerId={timerId}
            initialStartDate={new Date(startTime)}
            initialStopDate={endTime ? new Date(endTime) : null}
            onSuccessEdit={() => setIsOnEditMode(false)}
            onCancel={() => setIsOnEditMode(false)}
          />
        )}

        {!inProgress && !isOnEditMode && (
          <>
            <LaborEntry timeType="end" timestamp={endTime} />
            <LaborEntry timeType="start" timestamp={startTime} />

            <Text
              className="labor-block-duration"
              position="absolute"
              bgColor="white"
              h="1.75rem"
              px={1.75}
              rounded="md.lg"
              borderWidth="1px"
              borderColor="gray.100"
              fontWeight="medium"
              color="gray.900"
              top="50%"
              right="calc(token(spacing.3) - 1px)"
              transform="translateY(-50%)"
              display="flex"
              alignItems="center"
            >
              {timeWorked}
            </Text>
          </>
        )}

        {!isOnEditMode && (
          <UnlockedOnly>
            <ButtonGroup
              className="labor-block-button-group"
              pos="absolute"
              top="50%"
              right="calc(token(spacing.3) - 1px)"
              transform="translateY(-50%)"
            >
              <IconButton
                title="Edit labor"
                onClick={() => setIsOnEditMode(true)}
              >
                <Icon.Edit />
              </IconButton>
              <IconButton
                title="Remove labor"
                onClick={() => setIsLaborRemovalModalOpen(true)}
              >
                <Icon.Trash className={css({ color: 'danger' })} />
              </IconButton>
            </ButtonGroup>
          </UnlockedOnly>
        )}
      </Container>

      <ConfirmLaborRemovalModal
        open={isLaborRemovalModalOpen}
        laborTitle={laborTitle}
        timerId={timerId}
        onSuccessfulRemoval={() => setIsLaborRemovalModalOpen(false)}
        onClose={() => setIsLaborRemovalModalOpen(false)}
      />
    </>
  );
}
