import { useState } from 'react';
import * as Ariakit from '@ariakit/react';
import { useQueryClient } from '@tanstack/react-query';
import { match } from 'ts-pattern';

import { nextTickScheduler } from '@/app/_utils';
import { S } from '@/app/(app)/jobs/(index)/_components';
import {
  DEFAULT_SERVICE_PART_DATA,
  useDeleteVehicleService,
  useGetJob,
  useGetPriceSummary,
  useGetServiceTypes,
  usePatchVehicleService,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useJobWorkflowStatus,
  usePageAtom,
  useShouldBlurSection,
  useVehicle,
  useVehicleService,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { DotsFlashing } from '@/app/(app)/jobs/(index)/[id]/_components/DotsFlashing';
import {
  UnlockedOnly,
  useIsJobUnlocked,
} from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import type {
  ServicePart,
  VehicleService,
} from '@/app/(app)/jobs/(index)/[id]/_types';
import {
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Modal,
  Text,
  toast,
} from '@/components';
import { css } from '@/styled-system/css';
import { Center, Flex, styled } from '@/styled-system/jsx';
import { center } from '@/styled-system/patterns';

import { Part } from './Part';
import { ServiceForm } from './ServiceForm';

const ServiceDetail = styled(S.Common.ActionButtonsContainer, {
  base: {
    display: 'flex',
    gap: 2.3,
    p: 3,
    rounded: 'lg',
    borderWidth: '1.5px',
    borderStyle: 'dashed',
    position: 'relative',
    transitionProperty: 'background-color, border-color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',
  },
  variants: {
    variant: {
      READY: {
        bgColor: 'rgba(1, 2, 3, 0.04)',
        borderColor: 'gray.300',
      },
      STARTED: {
        bgColor: 'rgba(0, 204, 102, 0.04)',
        borderColor: 'primary',
      },
      PAUSED: {
        bgColor: 'rgba(255, 175, 10, 0.04)',
        borderColor: 'warning',
      },
      COMPLETED: {
        bgColor: 'rgba(1, 2, 3, 0.04)',
        borderColor: 'gray.300',
      },
    },
    blur: {
      true: {},
    },
  },
  compoundVariants: [
    {
      blur: true,
      variant: 'READY',
      css: {
        borderColor: 'rgba(194, 198, 204, 0.40)',
        bgColor: 'rgba(235, 237, 240, 0.40)',
      },
    },
    {
      blur: true,
      variant: 'STARTED',
      css: {
        borderColor: 'rgba(0, 204, 102, 0.40)',
        bgColor: 'rgba(245, 253, 249, 0.40)',
      },
    },
    {
      blur: true,
      variant: 'PAUSED',
      css: {
        borderColor: 'rgba(255, 175, 10, 0.40)',
        bgColor: 'rgba(255, 252, 245, 0.40)',
      },
    },
    {
      blur: true,
      variant: 'COMPLETED',
      css: {
        borderColor: 'rgba(194, 198, 204, 0.40)',
        bgColor: 'rgba(235, 237, 240, 0.40)',
      },
    },
  ],
  defaultVariants: {
    variant: 'READY',
  },
});

const TEMPORARY_PART_ID = 111.1;

interface ServiceProps {
  id: number;
  vehicleId: number;
  index: number;
  showForm?: boolean;
  disabled?: boolean;
  onCancelCreation?: () => void;
  onSuccessfulUpdate?: () => void;
  onSuccessfulDelete?: () => void;
  onEditRequest?: (service: VehicleService) => void;
  onCancelEditing?: () => void;
}

export function Service({
  id,
  vehicleId,
  index,
  showForm,
  disabled,
  onCancelCreation,
  onSuccessfulUpdate,
  onSuccessfulDelete,
  onEditRequest,
  onCancelEditing,
}: ServiceProps) {
  const jobId = useJobId();

  const queryClient = useQueryClient();

  const shouldBlurSection = useShouldBlurSection();
  const pageAtom = usePageAtom();
  const jobWorkflowStatus = useJobWorkflowStatus();

  const isJobUnlocked = useIsJobUnlocked();

  const vehicle = useVehicle(vehicleId);
  const vehicleService = useVehicleService({ serviceId: id, vehicleId });

  const getJob = useGetJob(jobId);
  const getServiceTypes = useGetServiceTypes();

  const [isDeleteServiceModalOpen, setIsDeleteServiceModalOpen] =
    useState(false);
  const [isCreatingPart, setIsCreatingPart] = useState(false);
  const [currentEditingPartId, setCurrentEditingPartId] = useState<
    number | null
  >(null);

  function handleSuccessfulServicePatch(data: VehicleService) {
    getJob.updateData({
      jobVehicles: getJob.data?.jobVehicles.map(_vehicle => {
        if (_vehicle.id === vehicleId) {
          return {
            ..._vehicle,
            jobServices: _vehicle.jobServices.map(service => {
              if (service.id === id) {
                return {
                  jobServiceParts: service.jobServiceParts,
                  ...data,
                };
              }

              return service;
            }),
          };
        }

        return _vehicle;
      }),
    });

    onSuccessfulUpdate?.();
  }

  const patchVehicleService = usePatchVehicleService(
    { id, vehicleId, jobId },
    {
      onSuccess(data) {
        if (jobWorkflowStatus === 'draft') {
          return;
        }

        handleSuccessfulServicePatch(data);
      },
    }
  );
  const deleteVehicleService = useDeleteVehicleService(
    { jobId, vehicleId },
    {
      onSuccess() {
        vehicle.removeService(id);

        if (jobWorkflowStatus === 'draft') {
          return;
        }

        getJob.updateData({
          jobVehicles: getJob.data?.jobVehicles.map(_vehicle => {
            if (_vehicle.id === vehicleId) {
              return {
                ..._vehicle,
                jobServices: _vehicle.jobServices.filter(
                  service => service.id !== id
                ),
              };
            }

            return _vehicle;
          }),
        });
        setIsDeleteServiceModalOpen(false);
        onSuccessfulDelete?.();
        nextTickScheduler(() =>
          document.getElementById('add-new-service-button')?.focus()
        );

        void queryClient.invalidateQueries({
          queryKey: [useGetPriceSummary.queryKey],
        });

        toast.success('Service deleted successfully');
      },
    }
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

  const serviceServerData = getJob.data?.jobVehicles
    .find(_vehicle => _vehicle.id === vehicleId)
    ?.jobServices.find(service => service.id === id);

  const parts = pageAtom.data.focusedSection?.includes('vehicle_creation')
    ? vehicleService.data?.jobServiceParts.filter(
        part => part.id !== TEMPORARY_PART_ID
      )
    : serviceServerData?.jobServiceParts;

  function handleDeleteVehicleService() {
    if (jobWorkflowStatus === 'draft') {
      deleteVehicleService.mutate({ id });
      return;
    }

    if (pageAtom.data.focusedSection === 'service_editing') {
      setIsDeleteServiceModalOpen(true);
      return;
    }

    vehicle.removeService(id);
  }

  function handleAddPart() {
    setIsCreatingPart(true);

    if (serviceServerData) {
      vehicle.addService(serviceServerData);
    }

    vehicleService.addPart({
      id: TEMPORARY_PART_ID,
      ...DEFAULT_SERVICE_PART_DATA,
    });

    if (pageAtom.data.focusedSection?.includes('vehicle_creation')) {
      pageAtom.pushFocusedSection('part_creation');
      return;
    }

    pageAtom.setFocusedSection('part_creation');
  }

  function handleEditPartRequest(part: ServicePart) {
    if (serviceServerData) {
      vehicle.addService(serviceServerData);
    }

    vehicleService.addPart(part);
    setCurrentEditingPartId(part.id);

    if (pageAtom.data.focusedSection?.includes('vehicle_creation')) {
      pageAtom.pushFocusedSection('part_editing');
      return;
    }

    pageAtom.setFocusedSection('part_editing');
  }

  function handlePartFormSuccessfulSubmit() {
    if (pageAtom.data.focusedSection?.includes('part_creation')) {
      setIsCreatingPart(false);
      return;
    }

    setCurrentEditingPartId(null);
  }

  function handleCancelPartEdit() {
    if (pageAtom.data.focusedSection?.includes('part_creation')) {
      setIsCreatingPart(false);
      pageAtom.removeFocusedSection('part_creation');
      vehicleService.removePart(TEMPORARY_PART_ID);
      return;
    }

    pageAtom.removeFocusedSection('part_editing');
    setCurrentEditingPartId(null);
  }

  return (
    <Ariakit.FocusTrapRegion
      enabled={
        pageAtom.data.focusedSection === 'service_creation' ||
        pageAtom.data.focusedSection === 'service_editing'
      }
    >
      <ServiceDetail
        variant={serviceServerData?.status}
        focusable={jobWorkflowStatus === 'published' && !shouldBlurSection}
        disabled={!isJobUnlocked}
        blur={shouldBlurFields}
      >
        <Center h={3.5} w={3.5}>
          {match(serviceServerData?.status)
            .with('COMPLETED', () => (
              <Icon.CheckCircle
                className={css(
                  {
                    fontSize: 'md',
                    flexShrink: 0,
                    color: 'primary',
                  },
                  shouldBlurFields ? S.blurredStyles.raw() : {}
                )}
              />
            ))
            .with('STARTED', () => (
              <DotsFlashing
                css={shouldBlurFields ? S.blurredStyles.raw() : {}}
              />
            ))
            .with('PAUSED', () => (
              <Icon.InProgress
                className={css(
                  {
                    fontSize: 'md',
                    flexShrink: 0,
                    color: 'warning',
                  },
                  shouldBlurFields ? S.blurredStyles.raw() : {}
                )}
              />
            ))
            .otherwise(() => (
              <Center
                h={4}
                w={4}
                bgColor="rgba(1, 2, 3, 0.12)"
                rounded="full"
                flexShrink={0}
                fontSize="0.625rem"
                lineHeight={1}
                fontWeight="semibold"
                color="gray.900"
                userSelect="none"
                css={shouldBlurFields ? S.blurredStyles.raw() : {}}
              >
                {index}
              </Center>
            ))}
        </Center>

        <Flex
          direction="column"
          gap={2}
          flex={1}
          maxWidth="calc(100% - 0.875rem - 0.625rem)"
        >
          {jobWorkflowStatus === 'draft' ||
          pageAtom.data.focusedSection?.includes('vehicle_creation') ||
          showForm ? (
            <ServiceForm
              serviceId={id}
              vehicleId={vehicleId}
              disabled={disabled}
              isLoadingDelete={deleteVehicleService.isLoading}
              service={serviceServerData}
              showForm={showForm}
              onCancelCreation={onCancelCreation}
              onCancelEditing={onCancelEditing}
              onDeleteRequest={handleDeleteVehicleService}
              onSuccessfulUpdate={handleSuccessfulServicePatch}
            />
          ) : (
            <>
              <Flex
                direction="column"
                gap={1.5}
                css={shouldBlurFields ? S.blurredStyles.raw() : {}}
              >
                {!!serviceServerData?.service_id && (
                  <Text color="gray.700" fontWeight="semibold">
                    {getServiceTypes.data?.[serviceServerData.service_id].name}
                  </Text>
                )}

                <Text lineHeight="md">{serviceServerData?.description}</Text>
              </Flex>

              {!!serviceServerData && (
                <ButtonGroup
                  className="actions-container"
                  pos="absolute"
                  right={1.5}
                  top={1.5}
                  display={shouldBlurFields ? 'none!' : undefined}
                >
                  <IconButton
                    title={`Mark service as ${
                      serviceServerData?.status === 'COMPLETED'
                        ? 'in progress'
                        : 'completed'
                    }`}
                    disabled={patchVehicleService.isLoading}
                    loading={patchVehicleService.isLoading}
                    onClick={() =>
                      patchVehicleService.mutate({
                        status:
                          serviceServerData?.status === 'COMPLETED'
                            ? 'PAUSED'
                            : 'COMPLETED',
                      })
                    }
                  >
                    {serviceServerData?.status === 'COMPLETED' ? (
                      <Icon.InProgress />
                    ) : (
                      <Icon.CheckCircle />
                    )}
                  </IconButton>
                  <IconButton
                    title="Edit service"
                    onClick={() => onEditRequest?.(serviceServerData)}
                  >
                    <Icon.Edit />
                  </IconButton>
                  {(services?.length ?? 0) > 1 && (
                    <IconButton
                      title="Remove service"
                      onClick={() => setIsDeleteServiceModalOpen(true)}
                    >
                      <Icon.Trash className={css({ color: 'danger' })} />
                    </IconButton>
                  )}
                </ButtonGroup>
              )}
            </>
          )}

          <Flex
            direction="column"
            gap={1.5}
            css={{ _empty: { display: 'none' } }}
          >
            {jobWorkflowStatus === 'published' &&
              parts?.map(part => (
                <Part
                  key={part.id}
                  id={part.id}
                  part={part}
                  serviceId={id}
                  vehicleId={vehicleId}
                  showForm={part.id === currentEditingPartId}
                  disabled={disabled}
                  onClick={() => handleEditPartRequest(part)}
                  onSuccessfulSubmit={handlePartFormSuccessfulSubmit}
                  onCancel={handleCancelPartEdit}
                />
              ))}

            {isCreatingPart && (
              <Part
                showForm
                id={TEMPORARY_PART_ID}
                vehicleId={vehicleId}
                serviceId={id}
                onSuccessfulSubmit={handlePartFormSuccessfulSubmit}
                onCancel={handleCancelPartEdit}
              />
            )}

            <UnlockedOnly>
              {jobWorkflowStatus === 'published' && !isCreatingPart && (
                <button
                  type="button"
                  tabIndex={
                    (shouldBlurSection &&
                      !pageAtom.data.focusedSection?.includes(
                        'vehicle_creation'
                      )) ||
                    pageAtom.data.focusedSection?.includes('part_editing') ||
                    pageAtom.data.focusedSection?.includes('part_creation')
                      ? -1
                      : undefined
                  }
                  className={css(
                    {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      color: 'gray.500',
                      lineHeight: 1,
                      fontWeight: 'semibold',
                      cursor: 'pointer',
                      bgColor: 'rgba(1, 2, 3, 0.04)',
                      rounded: 'lg',
                      height: 9,
                      px: 3,
                      transitionProperty: 'color, opacity',
                      transitionDuration: 'fast',
                      transitionTimingFunction: 'ease-in-out',

                      _hover: { color: 'gray.700' },

                      _active: { color: 'gray.500' },

                      _disabled: { opacity: 0.6, pointerEvents: 'none' },
                    },
                    (shouldBlurSection &&
                      !pageAtom.data.focusedSection?.includes(
                        'vehicle_creation'
                      )) ||
                      pageAtom.data.focusedSection?.includes('part_editing') ||
                      pageAtom.data.focusedSection?.includes('part_creation')
                      ? S.blurredStyles.raw()
                      : {}
                  )}
                  disabled={disabled}
                  onClick={handleAddPart}
                >
                  <span className={center({ h: 3.5, w: 3.5 })}>
                    <Icon.Plus className={css({ flexShrink: 0 })} />
                  </span>
                  Add part
                </button>
              )}
            </UnlockedOnly>
          </Flex>
        </Flex>
      </ServiceDetail>

      <Modal
        open={isDeleteServiceModalOpen}
        unmountOnHide
        hideOnEscape={!deleteVehicleService.isLoading}
        hideOnInteractOutside={!deleteVehicleService.isLoading}
        onClose={() => setIsDeleteServiceModalOpen(false)}
      >
        <Modal.Heading>Remove service?</Modal.Heading>
        <Modal.Description>
          Are you sure you want to remove the{' '}
          <strong className={css({ fontWeight: 'semibold' })}>
            {pageAtom.data.focusedSection === 'service_editing'
              ? getServiceTypes.data?.[vehicleService.data?.service_id ?? -1]
                  ?.name
              : getServiceTypes.data?.[serviceServerData?.service_id ?? -1]
                  ?.name}
          </strong>{' '}
          service? All associated parts will also be removed.
        </Modal.Description>

        <Flex justify="flex-end" gap={2} mt={3}>
          <Modal.Dismiss disabled={deleteVehicleService.isLoading}>
            Cancel
          </Modal.Dismiss>
          <Button
            size="sm"
            danger
            disabled={deleteVehicleService.isLoading}
            loading={deleteVehicleService.isLoading}
            onClick={() => deleteVehicleService.mutate({ id })}
          >
            Delete
          </Button>
        </Flex>
      </Modal>
    </Ariakit.FocusTrapRegion>
  );
}
