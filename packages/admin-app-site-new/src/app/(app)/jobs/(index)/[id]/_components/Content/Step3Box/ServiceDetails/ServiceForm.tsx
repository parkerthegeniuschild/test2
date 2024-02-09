import { useState } from 'react';
import { flushSync } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';

import { S } from '@/app/(app)/jobs/(index)/_components';
import {
  useGetJob,
  useGetPriceSummary,
  useGetServiceTypes,
  usePatchVehicleService,
  usePostVehicleService,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useJobWorkflowStatus,
  usePageAtom,
  useShouldBlurSection,
  useStep3Atom,
  useVehicle,
  useVehicleService,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import {
  useFormFieldDebounce,
  useJobId,
} from '@/app/(app)/jobs/(index)/[id]/_hooks';
import type {
  JobService,
  VehicleService,
} from '@/app/(app)/jobs/(index)/[id]/_types';
import { vehicleValidation } from '@/app/(app)/jobs/(index)/[id]/_utils';
import { Button, ErrorMessage, Icon, StackedInput, toast } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

interface ServiceFormProps {
  serviceId: number;
  vehicleId: number;
  showForm?: boolean;
  service?: JobService;
  disabled?: boolean;
  isLoadingDelete?: boolean;
  onSuccessfulUpdate?: (data: VehicleService) => void;
  onCancelCreation?: () => void;
  onCancelEditing?: () => void;
  onDeleteRequest?: () => void;
}

export function ServiceForm({
  serviceId,
  vehicleId,
  showForm,
  service,
  disabled,
  isLoadingDelete,
  onSuccessfulUpdate,
  onCancelCreation,
  onCancelEditing,
  onDeleteRequest,
}: ServiceFormProps) {
  const jobId = useJobId();

  const shouldBlurSection = useShouldBlurSection();
  const pageAtom = usePageAtom();
  const step3Atom = useStep3Atom();
  const jobWorkflowStatus = useJobWorkflowStatus();

  const queryClient = useQueryClient();

  const vehicle = useVehicle(vehicleId);
  const vehicleService = useVehicleService({ serviceId, vehicleId });

  const getJob = useGetJob(jobId);
  const getServiceTypes = useGetServiceTypes();

  const [serviceValue, setServiceValue] = useState(
    vehicleService.data?.service_id
      ? getServiceTypes.data?.[vehicleService.data.service_id].name ?? ''
      : ''
  );

  const postVehicleService = usePostVehicleService(jobId, {
    onSuccess(data) {
      pageAtom.setFocusedSection(null);
      step3Atom.setShouldValidateFields(false);
      vehicle.removeService(serviceId);
      vehicle.addService(data);
      getJob.updateData({
        jobVehicles: getJob.data?.jobVehicles.map(_vehicle => {
          if (_vehicle.id === vehicleId) {
            return {
              ..._vehicle,
              jobServices: [
                ...(_vehicle.jobServices ?? []),
                { jobServiceParts: [], ...data },
              ],
            };
          }

          return _vehicle;
        }),
      });

      void queryClient.invalidateQueries({
        queryKey: [useGetPriceSummary.queryKey],
      });

      toast.success('Service created successfully');
    },
  });
  const patchVehicleService = usePatchVehicleService(
    { id: serviceId, vehicleId, jobId },
    {
      onSuccess(data) {
        if (jobWorkflowStatus === 'draft') {
          return;
        }

        setServiceValue(
          data.service_id
            ? getServiceTypes.data?.[data.service_id].name ?? ''
            : ''
        );
        onSuccessfulUpdate?.(data);

        void queryClient.invalidateQueries({
          queryKey: [useGetPriceSummary.queryKey],
        });

        toast.success('Service updated successfully');
      },
    }
  );

  useFormFieldDebounce(
    () =>
      patchVehicleService.mutate({
        description: vehicleService.data?.description.trim() ?? '',
      }),
    [vehicleService.data?.description, jobWorkflowStatus],
    { enabled: jobWorkflowStatus === 'draft' }
  );

  const shouldBlurFields =
    (shouldBlurSection &&
      !pageAtom.data.focusedSection?.includes('vehicle_creation')) ||
    pageAtom.data.focusedSection?.includes('part_creation') ||
    pageAtom.data.focusedSection?.includes('part_editing');

  const services =
    jobWorkflowStatus === 'draft' ||
    pageAtom.data.focusedSection?.includes('vehicle_creation')
      ? vehicle.data.jobServices
      : getJob.data?.jobVehicles.find(v => v.id === vehicleId)?.jobServices;

  const isValidServiceType = vehicleValidation.check.isValidServiceType(
    vehicleService.data
  );
  const shouldShowServiceTypeError =
    step3Atom.data.shouldValidateFields && !isValidServiceType;

  const isValidServiceDescription =
    vehicleValidation.check.isValidServiceDescription(vehicleService.data);
  const shouldShowServiceDescriptionError =
    step3Atom.data.shouldValidateFields && !isValidServiceDescription;

  function handleServiceTypeChange(selectedServiceTypeId?: number | null) {
    if (jobWorkflowStatus === 'draft') {
      patchVehicleService.mutate({ service_id: selectedServiceTypeId ?? null });
    }

    flushSync(() =>
      vehicleService.setData({ service_id: selectedServiceTypeId ?? null })
    );
  }

  function handleCreateService() {
    step3Atom.setShouldValidateFields(true);

    const isValidFields = isValidServiceType && isValidServiceDescription;

    if (!isValidFields) {
      return;
    }

    postVehicleService.mutate({
      vehicleId,
      service_id: vehicleService.data?.service_id ?? null,
      description: vehicleService.data?.description.trim() ?? '',
    });
  }

  function handleCancelEditing() {
    onCancelEditing?.();
    setServiceValue(
      getServiceTypes.data?.[service?.service_id ?? -1]?.name ?? ''
    );
  }

  function handleSaveService() {
    step3Atom.setShouldValidateFields(true);

    const isValidFields = isValidServiceType && isValidServiceDescription;

    if (!isValidFields) {
      return;
    }

    patchVehicleService.mutate({
      service_id: vehicleService.data?.service_id ?? null,
      description: vehicleService.data?.description.trim() ?? '',
    });
  }

  return (
    <Flex
      direction="column"
      gap={2.3}
      css={shouldBlurFields && !showForm ? S.blurredStyles.raw() : {}}
    >
      <StackedInput>
        <StackedInput.Combobox
          placeholder="Add service"
          data-service-type-combobox
          portal={false}
          disabled={pageAtom.data.isPublishing}
          tabIndex={shouldBlurFields && !showForm ? -1 : undefined}
          scrollContainerProps={{ style: { maxHeight: '13.4375rem' } }}
          error={shouldShowServiceTypeError}
          value={serviceValue}
          onChange={v => {
            if (v === '') {
              handleServiceTypeChange(null);
            }

            setServiceValue(v);
          }}
          onOpenChange={open => {
            const isClosing = !open;

            if (isClosing) {
              setServiceValue(
                getServiceTypes.data?.[vehicleService.data?.service_id ?? -1]
                  ?.name ?? ''
              );
            }
          }}
        >
          {Object.entries(getServiceTypes.data ?? {}).map(
            ([serviceTypeId, serviceType]) => (
              <StackedInput.Combobox.Item
                key={serviceTypeId}
                value={serviceType.name}
                css={{ fontWeight: 'medium' }}
                onClick={() => {
                  handleServiceTypeChange(Number(serviceTypeId));
                  setServiceValue(serviceType.name);
                }}
              >
                <Icon.Tool className={css({ color: 'gray.300' })} />
                {serviceType.name}
              </StackedInput.Combobox.Item>
            )
          )}
        </StackedInput.Combobox>
        <StackedInput.Textarea
          rows={4}
          placeholder="What problem is the vehicle having?"
          tabIndex={shouldBlurFields && !showForm ? -1 : undefined}
          disabled={pageAtom.data.isPublishing}
          error={shouldShowServiceDescriptionError}
          value={vehicleService.data?.description ?? ''}
          onChange={e =>
            vehicleService.setData({ description: e.target.value })
          }
        />
      </StackedInput>

      {(shouldShowServiceTypeError || shouldShowServiceDescriptionError) && (
        <ErrorMessage>Please enter service details</ErrorMessage>
      )}

      <Flex css={{ _empty: { display: 'none' } }}>
        {pageAtom.data.focusedSection === 'service_creation' && (
          <Flex gap={3} ml="auto">
            <Button
              size="sm"
              variant="secondary"
              disabled={postVehicleService.isLoading}
              onClick={onCancelCreation}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={postVehicleService.isLoading}
              loading={postVehicleService.isLoading}
              onClick={handleCreateService}
            >
              Save service
            </Button>
          </Flex>
        )}

        {pageAtom.data.focusedSection === 'service_editing' && (
          <Flex gap={3}>
            <Button
              size="sm"
              variant="secondary"
              disabled={patchVehicleService.isLoading}
              onClick={handleCancelEditing}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={patchVehicleService.isLoading}
              loading={patchVehicleService.isLoading}
              onClick={handleSaveService}
            >
              Save changes
            </Button>
          </Flex>
        )}

        {(services?.length ?? 0) > 1 &&
          pageAtom.data.focusedSection !== 'service_creation' && (
            <Button
              variant="secondary"
              danger
              size="sm"
              ml="auto"
              tabIndex={
                shouldBlurFields &&
                pageAtom.data.focusedSection !== 'service_editing'
                  ? -1
                  : undefined
              }
              disabled={
                (isLoadingDelete && jobWorkflowStatus === 'draft') ||
                (patchVehicleService.isLoading &&
                  pageAtom.data.focusedSection === 'service_editing') ||
                pageAtom.data.isPublishing ||
                disabled
              }
              loading={
                isLoadingDelete &&
                pageAtom.data.focusedSection !== 'service_editing'
              }
              onClick={onDeleteRequest}
            >
              Delete service
            </Button>
          )}
      </Flex>
    </Flex>
  );
}
