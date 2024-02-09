import { useState } from 'react';

import { nextTickScheduler } from '@/app/_utils';
import { S } from '@/app/(app)/jobs/(index)/_components';
import {
  DEFAULT_VEHICLE_SERVICE_DATA,
  useGetJob,
  usePostVehicleService,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useJobWorkflowStatus,
  usePageAtom,
  useShouldBlurSection,
  useStep3Atom,
  useVehicle,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { UnlockedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import type { VehicleService } from '@/app/(app)/jobs/(index)/[id]/_types';
import { ErrorMessage, Icon, Text } from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';
import { center } from '@/styled-system/patterns';

import { Service } from './Service';

const TEMPORARY_SERVICE_ID = 111.1;

function focusOnLastServiceTypeCombobox() {
  nextTickScheduler(() =>
    (
      Array.from(
        document.querySelectorAll('[data-service-type-combobox]')
      ) as HTMLElement[]
    )
      .at(-1)
      ?.focus()
  );
}

interface ServiceDetailsProps {
  vehicleId: number;
  disabled?: boolean;
}

export function ServiceDetails({ vehicleId, disabled }: ServiceDetailsProps) {
  const jobId = useJobId();

  const shouldBlurSection = useShouldBlurSection();
  const step3Atom = useStep3Atom();
  const pageAtom = usePageAtom();
  const jobWorkflowStatus = useJobWorkflowStatus();
  const vehicle = useVehicle(vehicleId);

  const getJob = useGetJob(jobId);

  const [currentEditingServiceId, setCurrentEditingServiceId] = useState<
    number | null
  >(null);

  const services =
    jobWorkflowStatus === 'draft' ||
    pageAtom.data.focusedSection?.includes('vehicle_creation')
      ? vehicle.data.jobServices
      : getJob.data?.jobVehicles.find(v => v.id === vehicleId)?.jobServices;

  const postVehicleService = usePostVehicleService(jobId, {
    onSuccess(data) {
      vehicle.addService(data);
      focusOnLastServiceTypeCombobox();
    },
  });

  function handleAddService() {
    if (jobWorkflowStatus === 'draft') {
      postVehicleService.mutate({
        ...DEFAULT_VEHICLE_SERVICE_DATA,
        service_id: null,
        vehicleId,
      });
      return;
    }

    if (pageAtom.data.focusedSection?.includes('vehicle_creation')) {
      vehicle.addService({
        id: (vehicle.data.jobServices.at(-1)?.id ?? 1.1) + 1,
        service_id: null,
        ...DEFAULT_VEHICLE_SERVICE_DATA,
      });
      focusOnLastServiceTypeCombobox();
      return;
    }

    pageAtom.setFocusedSection('service_creation');
    vehicle.addService({
      id: TEMPORARY_SERVICE_ID,
      service_id: null,
      ...DEFAULT_VEHICLE_SERVICE_DATA,
    });
    focusOnLastServiceTypeCombobox();
  }

  function handleCancelServiceCreation() {
    pageAtom.setFocusedSection(null);
    vehicle.removeService(TEMPORARY_SERVICE_ID);
    step3Atom.setShouldValidateFields(false);
  }

  function handleEditRequest(service: VehicleService) {
    vehicle.addService(service);
    pageAtom.setFocusedSection('service_editing');
    setCurrentEditingServiceId(service.id);
  }

  function resetServiceEditingState() {
    if (!currentEditingServiceId) {
      return;
    }

    pageAtom.setFocusedSection(null);
    step3Atom.setShouldValidateFields(false);
    setCurrentEditingServiceId(null);
  }

  return (
    <Box mt={6}>
      {(jobWorkflowStatus === 'draft' ||
        pageAtom.data.focusedSection?.includes('vehicle_creation')) && (
        <Text
          fontWeight="medium"
          color="gray.600"
          mb={2}
          css={
            (shouldBlurSection &&
              !pageAtom.data.focusedSection?.includes('vehicle_creation')) ||
            pageAtom.data.focusedSection?.includes('part_creation') ||
            pageAtom.data.focusedSection?.includes('part_editing')
              ? S.blurredStyles.raw()
              : {}
          }
        >
          Service details
        </Text>
      )}

      {step3Atom.data.shouldValidateFields &&
        vehicle.data.jobServices.length === 0 && (
          <ErrorMessage mb={2}>At least one service must be added</ErrorMessage>
        )}

      <Flex direction="column" gap={1.5}>
        {services?.map((service, index) => (
          <Service
            key={service.id}
            id={service.id}
            vehicleId={vehicleId}
            index={index + 1}
            showForm={service.id === currentEditingServiceId}
            disabled={disabled}
            onEditRequest={handleEditRequest}
            onSuccessfulUpdate={resetServiceEditingState}
            onSuccessfulDelete={resetServiceEditingState}
            onCancelEditing={resetServiceEditingState}
          />
        ))}

        {pageAtom.data.focusedSection === 'service_creation' && (
          <Service
            id={TEMPORARY_SERVICE_ID}
            vehicleId={vehicleId}
            showForm
            index={(services?.length ?? 0) + 1}
            onCancelCreation={handleCancelServiceCreation}
          />
        )}

        <UnlockedOnly>
          <button
            type="button"
            id="add-new-service-button"
            tabIndex={
              (shouldBlurSection &&
                !pageAtom.data.focusedSection?.includes('vehicle_creation')) ||
              pageAtom.data.focusedSection?.includes('part_creation') ||
              pageAtom.data.focusedSection?.includes('part_editing')
                ? -1
                : undefined
            }
            disabled={
              postVehicleService.isLoading ||
              pageAtom.data.isPublishing ||
              disabled
            }
            className={css(
              {
                bgColor: 'rgba(1, 2, 3, 0.04)',
                rounded: 'lg',
                borderWidth: '1.5px',
                borderStyle: 'dashed',
                borderColor: 'gray.300',
                height: '2.375rem',
                px: 3,
                lineHeight: 1,
                cursor: 'pointer',
                fontWeight: 'semibold',
                color: 'gray.500',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1.5,
                transitionProperty: 'color, opacity',
                transitionDuration: 'fast',
                transitionTimingFunction: 'ease-in-out',

                _hover: { color: 'gray.700' },

                _active: { color: 'gray.500' },

                _disabled: { opacity: 0.6, pointerEvents: 'none' },
              },
              (shouldBlurSection &&
                !pageAtom.data.focusedSection?.includes('vehicle_creation')) ||
                pageAtom.data.focusedSection?.includes('part_creation') ||
                pageAtom.data.focusedSection?.includes('part_editing')
                ? S.blurredStyles.raw()
                : {}
            )}
            onClick={handleAddService}
          >
            <span className={center({ h: 3.5, w: 3.5 })}>
              <Icon.Plus className={css({ flexShrink: 0 })} />
            </span>
            Add service
          </button>
        </UnlockedOnly>
      </Flex>
    </Box>
  );
}
