import { useEffect, useState } from 'react';
import { FocusTrapRegion } from '@ariakit/react';

import { S } from '@/app/(app)/jobs/(index)/_components';
import {
  DEFAULT_VEHICLE_DATA,
  DEFAULT_VEHICLE_SERVICE_DATA,
  useGetJob,
  usePostVehicle,
  usePostVehicleService,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useJobWorkflowStatus,
  usePageAtom,
  useShouldBlurSection,
  useStep3Atom,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { UnlockedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import type {
  Vehicle,
  VehicleContact,
} from '@/app/(app)/jobs/(index)/[id]/_types';
import { vehicleValidation } from '@/app/(app)/jobs/(index)/[id]/_utils';
import { Heading, Icon, Tabs, Text, Tooltip } from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

import { ServiceDetails } from './ServiceDetails';
import { VehicleDetails } from './VehicleDetails';
import { VehicleShowcase } from './VehicleShowcase';

const TEMPORARY_VEHICLE_ID = 111.1; // Using a float to avoid collision with real vehicle ids

export function Step3Box() {
  const jobId = useJobId();

  const jobWorkflowStatus = useJobWorkflowStatus();
  const shouldBlurSection = useShouldBlurSection();

  const pageAtom = usePageAtom();
  const step3Atom = useStep3Atom();

  const [createdVehicle, setCreatedVehicle] = useState<Vehicle | null>(null);
  const [currentEditingVehicleId, setCurrentEditingVehicleId] = useState<
    number | null
  >(null);
  const [isVehicleCreationInFlight, setIsVehicleCreationInFlight] =
    useState(false);

  const getJob = useGetJob(jobId);

  const postVehicleService = usePostVehicleService(jobId, {
    onSuccess(data) {
      if (!createdVehicle) {
        return;
      }

      step3Atom.addVehicle({
        ...createdVehicle,
        jobServices: [{ jobServiceParts: [], ...data }],
      });
      step3Atom.setSelectedVehicleTabId(createdVehicle.id);
      setCreatedVehicle(null);
      void getJob.refetch();
    },
  });
  const postVehicle = usePostVehicle(jobId, {
    skipOnSettledEventEmit: true,
    onSuccess(data) {
      setCreatedVehicle(data);
      postVehicleService.mutate({
        vehicleId: data.id,
        service_id: null,
        ...DEFAULT_VEHICLE_SERVICE_DATA,
      });
    },
  });

  const vehicles =
    jobWorkflowStatus === 'draft'
      ? step3Atom.data.vehicles
      : getJob.data?.jobVehicles;

  useEffect(() => {
    if (
      pageAtom.data.currentStep === 3 &&
      (getJob.data?.jobVehicles.length ?? 0) > 0
    ) {
      document
        .getElementById(step3Atom.data.vehicles[0].id.toString())
        ?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageAtom.data.currentStep]);

  function handleAddNewVehicle() {
    if (jobWorkflowStatus === 'draft') {
      postVehicle.mutate(DEFAULT_VEHICLE_DATA);
      return;
    }

    pageAtom.closeDrawer('comments');
    pageAtom.closeDrawer('photos');
    pageAtom.setFocusedSection('vehicle_creation');
    step3Atom.addVehicle({
      id: TEMPORARY_VEHICLE_ID,
      ...DEFAULT_VEHICLE_DATA,
      jobServices: [
        {
          id: 1,
          service_id: null,
          ...DEFAULT_VEHICLE_SERVICE_DATA,
          jobServiceParts: [],
        },
      ],
    });
    step3Atom.setSelectedVehicleTabId(TEMPORARY_VEHICLE_ID);
  }

  function handleSuccessfulVehicleDelete(removedVehicleId: number) {
    const removedVehicleIndex =
      vehicles?.findIndex(_v => _v.id === removedVehicleId) ?? 1;
    const newSelectedVehicle = vehicles?.[removedVehicleIndex + 1];

    if (newSelectedVehicle) {
      step3Atom.setSelectedVehicleTabId(newSelectedVehicle.id);
    } else {
      step3Atom.setSelectedVehicleTabId(
        vehicles?.[removedVehicleIndex - 1].id ?? step3Atom.data.vehicles[0].id
      );
    }

    step3Atom.removeVehicle(removedVehicleId);
    getJob.updateData({
      jobVehicles:
        getJob.data?.jobVehicles.filter(_v => _v.id !== removedVehicleId) ?? [],
    });
    pageAtom.setFocusedSection(null);
    setCurrentEditingVehicleId(null);
  }

  function handleCancelVehicleCreation() {
    pageAtom.setFocusedSection(null);
    step3Atom.removeVehicle(TEMPORARY_VEHICLE_ID);
    step3Atom.setShouldValidateFields(false);
    step3Atom.setSelectedVehicleTabId(
      vehicles?.[0].id ?? step3Atom.data.vehicles[0].id
    );
  }

  function handleSuccessfulVehicleCreation(newVehicleId: number) {
    pageAtom.setFocusedSection(null);
    step3Atom.removeVehicle(TEMPORARY_VEHICLE_ID);
    step3Atom.setShouldValidateFields(false);
    step3Atom.setSelectedVehicleTabId(newVehicleId);

    const justAddedVehicle = getJob.getData()?.jobVehicles.at(-1);

    if (justAddedVehicle) {
      step3Atom.addVehicle(justAddedVehicle);
    }
  }

  function handleEditRequest(vehicle: VehicleContact) {
    step3Atom.addVehicle(vehicle);
    pageAtom.setFocusedSection('vehicle_editing');
    setCurrentEditingVehicleId(vehicle.id);
  }

  function resetVehicleEditingState() {
    if (!currentEditingVehicleId) {
      return;
    }

    pageAtom.setFocusedSection(null);
    setCurrentEditingVehicleId(null);
  }

  function handleVehicleTabChange(id: number) {
    step3Atom.setSelectedVehicleTabId(id);

    const selectedVehicle = getJob.data?.jobVehicles.find(
      vehicle => vehicle.id === id
    );

    if (selectedVehicle) {
      step3Atom.addVehicle(selectedVehicle);
    }
  }

  return (
    <Flex direction="column" px="var(--content-padding-x)" py={5}>
      {jobWorkflowStatus === 'draft' && (
        <Heading
          as="h2"
          fontSize="md"
          fontWeight="semibold"
          mb={6}
          css={shouldBlurSection ? S.blurredStyles.raw() : {}}
        >
          Add vehicle & services
        </Heading>
      )}

      {pageAtom.data.focusedSection === 'vehicle_editing' && (
        <Heading as="h2" fontSize="md" fontWeight="semibold">
          Edit vehicle{' '}
          {(vehicles?.findIndex(_v => _v.id === currentEditingVehicleId) ?? 0) +
            1}
        </Heading>
      )}

      {pageAtom.data.focusedSection !== 'vehicle_editing' && (
        <Box
          pos="relative"
          css={{
            _before: {
              content: '""',
              width: 6,
              height: '100%',
              position: 'absolute',
              left: 'calc(-1 * var(--content-padding-x))',
              zIndex: 1,
              bg: 'linear-gradient(90deg, #F5F7FA 47.5%, rgba(245, 247, 250, 0.00) 100%)',
            },

            _after: {
              content: '""',
              width: 6,
              height: '100%',
              position: 'absolute',
              right: 'calc(-1 * var(--content-padding-x))',
              bottom: 0,
              zIndex: 1,
              bg: 'linear-gradient(270deg, #F5F7FA 47.5%, rgba(245, 247, 250, 0.00) 100%)',
            },
          }}
        >
          <Tabs
            selectedId={String(step3Atom.data.selectedVehicleTabId)}
            setSelectedId={id => handleVehicleTabChange(Number(id))}
          >
            <Tabs.List
              className={css({
                ml: 'calc(-1 * var(--content-padding-x))',
                w: 'calc(100% + (var(--content-padding-x) * 2))',
                my: -0.5,
                py: 0.5,
                px: 6,
                overflowX: 'auto',
                overflowY: 'hidden',
              })}
            >
              {vehicles?.map((vehicle, index) => {
                const pausedServicesAmount = vehicle.jobServices.filter(
                  service => service.status === 'PAUSED'
                ).length;
                const areAllServicesCompleted =
                  vehicle.jobServices.length > 0 &&
                  vehicle.jobServices.every(
                    service => service.status === 'COMPLETED'
                  );

                return (
                  <Tooltip
                    key={vehicle.id.toString()}
                    gutter={1}
                    description={
                      <Flex direction="column" gap={1.75}>
                        <Text
                          fontWeight="semibold"
                          color="white"
                          css={{ _empty: { display: 'none' } }}
                        >
                          {[vehicle.year, vehicle.manufacturer, vehicle.model]
                            .filter(Boolean)
                            .join(' ')}
                        </Text>
                        <Text
                          size="sm"
                          color="gray.300"
                          display="flex"
                          flexDir="column"
                          gap={1.75}
                        >
                          <span>
                            {[vehicle.color, vehicle.type]
                              .filter(Boolean)
                              .join(' ')}

                            {!!vehicle.usdot && (
                              <>
                                <S.Common.Dot mx={1.25} />
                                USDOT #{vehicle.usdot}
                              </>
                            )}
                          </span>
                          <span
                            className={css({ _empty: { display: 'none' } })}
                          >
                            {!!vehicle.vin_serial &&
                              `VIN ${vehicle.vin_serial}`}
                            {!!vehicle.vin_serial && !!vehicle.unit && (
                              <S.Common.Dot mx={1.25} />
                            )}
                            {!!vehicle.unit && `Unit ${vehicle.unit}`}
                          </span>
                        </Text>
                        {pausedServicesAmount > 0 && (
                          <Text
                            size="sm"
                            color="warning"
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <Icon.InProgress />
                            {pausedServicesAmount} service
                            {pausedServicesAmount > 1 ? 's' : ''} incomplete
                          </Text>
                        )}
                      </Flex>
                    }
                    unmountOnHide
                    hidden={
                      step3Atom.data.selectedVehicleTabId === vehicle.id ||
                      jobWorkflowStatus === 'draft'
                    }
                    render={
                      <Tabs.Tab
                        id={String(vehicle.id)}
                        tabIndex={shouldBlurSection ? -1 : undefined}
                        className={css(
                          shouldBlurSection ? S.blurredStyles.raw() : {}
                        )}
                        bordered
                      />
                    }
                    css={{
                      px: 4,
                      py: 4,
                      bgColor: 'gray.800',
                      rounded: 'lg',
                      transform: 'translateY(-7px)',
                      shadow:
                        '0px 1px 2px 0px rgba(1, 2, 3, 0.08), 0px 4px 16px -8px rgba(1, 2, 3, 0.24)',
                    }}
                    showArrow
                  >
                    {jobWorkflowStatus === 'draft' &&
                      step3Atom.data.shouldValidateFields &&
                      !vehicleValidation.validate(vehicle) && (
                        <Icon.AlertTriangle
                          className={css({ color: 'danger' })}
                        />
                      )}
                    Vehicle {index + 1}
                    {pausedServicesAmount > 0 && (
                      <span
                        className={css({
                          w: 2,
                          h: 2,
                          bgColor: 'warning',
                          rounded: 'full',
                        })}
                      />
                    )}
                    {areAllServicesCompleted && (
                      <span
                        className={css({
                          w: 2,
                          h: 2,
                          bgColor: 'primary',
                          rounded: 'full',
                        })}
                      />
                    )}
                  </Tooltip>
                );
              })}

              {pageAtom.data.focusedSection?.includes('vehicle_creation') && (
                <Tabs.Tab
                  id={String(TEMPORARY_VEHICLE_ID)}
                  bordered
                  tabIndex={-1}
                  className={css(
                    pageAtom.data.focusedSection.includes('part_creation') ||
                      pageAtom.data.focusedSection.includes('part_editing')
                      ? S.blurredStyles.raw()
                      : {}
                  )}
                >
                  {step3Atom.data.shouldValidateFields &&
                    !vehicleValidation.validate(
                      step3Atom.data.vehicles.find(
                        _v => _v.id === TEMPORARY_VEHICLE_ID
                      )
                    ) && (
                      <Icon.AlertTriangle
                        className={css({ color: 'danger' })}
                      />
                    )}
                  Vehicle {(vehicles?.length ?? 0) + 1}
                </Tabs.Tab>
              )}

              <UnlockedOnly>
                <button
                  type="button"
                  tabIndex={shouldBlurSection ? -1 : undefined}
                  className={css(
                    {
                      alignSelf: 'flex-start',
                      lineHeight: 1,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: 1.5,
                      color: 'gray.900',
                      fontWeight: 'medium',
                      flexShrink: 0,
                      transition: 'opacity token(durations.fast) ease-in-out',

                      _disabled: {
                        opacity: 0.5,
                        pointerEvents: 'none',
                      },
                    },
                    shouldBlurSection ? S.blurredStyles.raw() : {}
                  )}
                  disabled={
                    postVehicle.isLoading ||
                    postVehicleService.isLoading ||
                    pageAtom.data.isPublishing
                  }
                  onClick={handleAddNewVehicle}
                >
                  <Icon.Plus
                    width="1em"
                    height="1em"
                    className={css({ color: 'gray.700' })}
                  />
                  New vehicle
                </button>
              </UnlockedOnly>
            </Tabs.List>
          </Tabs>
        </Box>
      )}

      {(getJob.data?.jobVehicles.length ?? 0) > 0 && (
        <FocusTrapRegion
          enabled={
            pageAtom.data.focusedSection?.includes('vehicle_creation') ||
            pageAtom.data.focusedSection === 'vehicle_editing'
          }
        >
          {jobWorkflowStatus === 'published' &&
          !pageAtom.data.focusedSection?.includes('vehicle_creation') &&
          pageAtom.data.focusedSection !== 'vehicle_editing' ? (
            <VehicleShowcase
              key={`vehicle_showcase_${step3Atom.data.selectedVehicleTabId}`}
              vehicleId={step3Atom.data.selectedVehicleTabId ?? -1}
              onEditRequest={handleEditRequest}
            />
          ) : (
            <VehicleDetails
              key={`vehicle_details_${step3Atom.data.selectedVehicleTabId}`}
              vehicleId={step3Atom.data.selectedVehicleTabId ?? -1}
              onSuccessfulDelete={handleSuccessfulVehicleDelete}
              onSuccessfulUpdate={resetVehicleEditingState}
              onSuccessfulCreation={handleSuccessfulVehicleCreation}
              onCancelCreation={handleCancelVehicleCreation}
              onCancelEditing={resetVehicleEditingState}
              onVehicleCreationInFlightChange={setIsVehicleCreationInFlight}
            />
          )}

          <ServiceDetails
            key={`service_details_${step3Atom.data.selectedVehicleTabId}`}
            vehicleId={step3Atom.data.selectedVehicleTabId ?? -1}
            disabled={isVehicleCreationInFlight}
          />
        </FocusTrapRegion>
      )}
    </Flex>
  );
}
