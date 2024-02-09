import { startTransition, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { useMask } from '@react-input/mask';
import { useNumberFormat } from '@react-input/number-format';
import { useQueryClient } from '@tanstack/react-query';
import { match, P } from 'ts-pattern';

import { format } from '@/app/_utils';
import { useIsMounted } from '@/app/(app)/_hooks';
import { Form, S } from '@/app/(app)/jobs/(index)/_components';
import {
  useDeleteVehicle,
  useGetJob,
  useGetPriceSummary,
  useGetVehicleManufacturers,
  usePatchVehicle,
  usePostVehicle,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useJobWorkflowStatus,
  usePageAtom,
  useShouldBlurSection,
  useStep3Atom,
  useVehicle,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import {
  useFormFieldDebounce,
  useJobId,
} from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { vehicleValidation } from '@/app/(app)/jobs/(index)/[id]/_utils';
import {
  Button,
  ErrorMessage,
  Modal,
  StackedInput,
  Text,
  toast,
} from '@/components';
import { css } from '@/styled-system/css';
import { Box, Flex } from '@/styled-system/jsx';

interface VehicleDetailsProps {
  vehicleId: number;
  onSuccessfulDelete?: (removedVehicleId: number) => void;
  onSuccessfulUpdate?: () => void;
  onSuccessfulCreation?: (newVehicleId: number) => void;
  onCancelCreation?: () => void;
  onCancelEditing?: () => void;
  onVehicleCreationInFlightChange?: (isInFlight: boolean) => void;
}

const VEHICLE_COLORS: Record<
  string,
  { backgroundColor: string; border?: string }
> = {
  White: {
    backgroundColor: 'white',
    border: '1px solid #dde1e5',
  },
  Black: {
    backgroundColor: '#262c33',
  },
  Gray: {
    backgroundColor: '#e4e8ed',
  },
  Yellow: {
    backgroundColor: '#eab308',
  },
  Orange: {
    backgroundColor: '#ff800a',
  },
  Pink: {
    backgroundColor: '#d53f8c',
  },
  Red: {
    backgroundColor: '#e53e3e',
  },
  Green: {
    backgroundColor: '#38a169',
  },
  Blue: {
    backgroundColor: '#1c92FF',
  },
  Purple: {
    backgroundColor: '#af00cc',
  },
  Tan: {
    backgroundColor: 'tan',
  },
  Brown: {
    backgroundColor: 'brown',
  },
};

export function VehicleDetails({
  vehicleId,
  onSuccessfulDelete,
  onSuccessfulUpdate,
  onSuccessfulCreation,
  onCancelCreation,
  onCancelEditing,
  onVehicleCreationInFlightChange,
}: VehicleDetailsProps) {
  const jobId = useJobId();

  const shouldBlurSection = useShouldBlurSection();

  const pageAtom = usePageAtom();
  const step3Atom = useStep3Atom();
  const jobWorkflowStatus = useJobWorkflowStatus();
  const vehicle = useVehicle(vehicleId);

  const queryClient = useQueryClient();

  const getJob = useGetJob(jobId);

  const getVehicleManufacturers = useGetVehicleManufacturers();

  const postVehicle = usePostVehicle(jobId, {
    refetchJobOnSuccess: true,
    onSuccess(data) {
      onSuccessfulCreation?.(data.id);
      void queryClient.invalidateQueries({
        queryKey: [useGetPriceSummary.queryKey],
      });

      toast.success('Vehicle created successfully');
    },
    onMutate() {
      onVehicleCreationInFlightChange?.(true);
    },
    onSettled() {
      onVehicleCreationInFlightChange?.(false);
    },
  });
  const patchVehicle = usePatchVehicle(jobId, {
    onSuccess(data) {
      onSuccessfulUpdate?.();

      if (jobWorkflowStatus === 'draft') {
        return;
      }

      getJob.updateData({
        jobVehicles: getJob.data?.jobVehicles?.map(jobVehicle =>
          jobVehicle.id === data.id
            ? {
                ...jobVehicle,
                ...data,
                mileage: data.mileage ? Number(data.mileage) : null,
              }
            : jobVehicle
        ),
      });
      toast.success('Vehicle updated successfully');
    },
  });
  const deleteVehicle = useDeleteVehicle(jobId, {
    onSuccess() {
      onSuccessfulDelete?.(vehicle.data.id);

      if (jobWorkflowStatus === 'published') {
        toast.success('Vehicle deleted successfully');
      }
    },
  });

  const isMounted = useIsMounted();

  const [manufacturerValue, setManufacturerValue] = useState(
    vehicle.data.manufacturer ?? ''
  );
  const [searchManufacturerValue, setSearchManufacturerValue] = useState('');
  const [isDeleteVehicleModalOpen, setIsDeleteVehicleModalOpen] =
    useState(false);

  const yearInputRef = useMask({ mask: '____', replacement: { _: /\d/ } });
  const mileageInputRef = useNumberFormat({
    locales: 'en',
    maximumFractionDigits: 0,
    signDisplay: 'never',
  });

  const manufacturerMatches = useMemo(
    () =>
      getVehicleManufacturers.data?.filter(manufacturer =>
        manufacturer
          .toLowerCase()
          .includes(searchManufacturerValue.toLowerCase())
      ),
    [getVehicleManufacturers.data, searchManufacturerValue]
  );

  const vehicles =
    jobWorkflowStatus === 'draft'
      ? step3Atom.data.vehicles
      : getJob.data?.jobVehicles;

  const isValidType = vehicleValidation.check.isValidType(vehicle.data);
  const isValidYear = vehicleValidation.check.isValidYear(vehicle.data);
  const isValidUsdot = vehicleValidation.check.isValidUsdot(vehicle.data);

  const shouldBlurFields =
    (shouldBlurSection &&
      !pageAtom.data.focusedSection?.includes('vehicle_creation') &&
      pageAtom.data.focusedSection !== 'vehicle_editing') ||
    pageAtom.data.focusedSection?.includes('part_creation') ||
    pageAtom.data.focusedSection?.includes('part_editing');

  useFormFieldDebounce(
    () =>
      patchVehicle.mutate({
        id: vehicleId,
        year: vehicle.data?.year ?? null,
      }),
    [vehicle.data?.year, jobWorkflowStatus],
    { enabled: isValidYear && jobWorkflowStatus === 'draft' }
  );

  useFormFieldDebounce(
    () =>
      patchVehicle.mutate({
        id: vehicleId,
        usdot: vehicle.data?.usdot ?? null,
      }),
    [vehicle.data?.usdot, jobWorkflowStatus],
    { enabled: isValidUsdot && jobWorkflowStatus === 'draft' }
  );

  useFormFieldDebounce(
    () =>
      patchVehicle.mutate({
        id: vehicleId,
        unit: vehicle.data?.unit?.trim() ?? null,
        model: vehicle.data?.model?.trim() ?? null,
        vin_serial: vehicle.data?.vin_serial?.trim() ?? null,
        mileage: vehicle.data?.mileage ?? null,
      }),
    [
      vehicle.data?.unit,
      vehicle.data?.model,
      vehicle.data?.vin_serial,
      vehicle.data?.mileage,
      jobWorkflowStatus,
    ],
    { enabled: jobWorkflowStatus === 'draft' }
  );

  function handleTypeChange(type: string) {
    vehicle.setData({ type });

    if (jobWorkflowStatus === 'draft') {
      patchVehicle.mutate({ id: vehicleId, type });
    }
  }

  function handleColorChange(color: string | null) {
    vehicle.setData({ color });

    if (jobWorkflowStatus === 'draft') {
      patchVehicle.mutate({ id: vehicleId, color });
    }
  }

  function handleManufacturerChange(manufacturer?: string) {
    flushSync(() => vehicle.setData({ manufacturer: manufacturer ?? '' }));

    if (jobWorkflowStatus === 'draft') {
      patchVehicle.mutate({ id: vehicleId, manufacturer: manufacturer ?? '' });
    }
  }

  function handleCreation() {
    step3Atom.setShouldValidateFields(true);

    const isValidFields = vehicleValidation.validate(vehicle.data);

    if (!isValidFields) {
      return;
    }

    const payload = {
      ...vehicle.data,
      unit: vehicle.data.unit?.trim() ?? null,
      model: vehicle.data.model?.trim() ?? null,
      vin_serial: vehicle.data.vin_serial?.trim() ?? null,
      services: vehicle.data.jobServices.map(jobService => ({
        ...jobService,
        parts: jobService.jobServiceParts.map(part => ({
          ...part,
          id: undefined,
          price: part.price.toString().replace(/,/g, ''),
          name: part.name.trim(),
          description: part.description?.trim(),
        })),
        description: jobService.description?.trim() ?? null,
        jobServiceParts: undefined,
        id: undefined,
      })),
      jobServices: undefined,
      id: undefined,
    };

    postVehicle.mutate(payload);
  }

  function handleDeleteVehicle() {
    deleteVehicle.mutate({ id: vehicleId });
  }

  function handleSaveVehicle() {
    const isValidFields = vehicleValidation.validate(vehicle.data, {
      validateOnlyVehicleFields: true,
    });

    if (!isValidFields) {
      return;
    }

    patchVehicle.mutate({
      id: vehicleId,
      type: vehicle.data.type,
      year: vehicle.data.year ?? null,
      unit: vehicle.data.unit?.trim() ?? null,
      model: vehicle.data.model?.trim() ?? null,
      color: vehicle.data.color,
      vin_serial: vehicle.data.vin_serial?.trim() ?? null,
      usdot: vehicle.data.usdot ?? null,
      mileage: vehicle.data.mileage ?? null,
      manufacturer: vehicle.data.manufacturer?.trim() ?? null,
    });
  }

  return (
    <>
      <Box mt={6} css={shouldBlurFields ? S.blurredStyles.raw() : {}}>
        <Text fontWeight="medium" color="gray.600">
          Vehicle details
        </Text>

        <StackedInput mt={2}>
          <StackedInput.Select
            label="Type"
            required
            showOnFocus={isMounted}
            placeholder="Select type"
            disabled={pageAtom.data.isPublishing}
            error={step3Atom.data.shouldValidateFields && !isValidType}
            value={vehicle.data?.type ?? ''}
            onChange={handleTypeChange}
            buttonProps={{
              tabIndex: shouldBlurFields ? -1 : undefined,
              autoFocus: true,
            }}
          >
            <StackedInput.Select.Item value="Truck with trailer" />
            <StackedInput.Select.Item value="Truck only" />
            <StackedInput.Select.Item value="Trailer only" />
            <StackedInput.Select.Item value="Dump truck" />
            <StackedInput.Select.Item value="Bus" />
            <StackedInput.Select.Item value="RV" />
            <StackedInput.Select.Item value="Equipment" />
          </StackedInput.Select>
          <StackedInput.HStack>
            <StackedInput.TextInput
              label="Unit #"
              placeholder="Enter unit #"
              disabled={pageAtom.data.isPublishing}
              value={vehicle.data?.unit ?? ''}
              onChange={e => vehicle.setData({ unit: e.target.value || null })}
              tabIndex={shouldBlurFields ? -1 : undefined}
            />
            <StackedInput.TextInput
              ref={yearInputRef}
              label="Year"
              placeholder="Enter year"
              disabled={pageAtom.data.isPublishing}
              error={!isValidYear}
              value={vehicle.data?.year ?? ''}
              onChange={e =>
                vehicle.setData({
                  year: e.target.value ? Number(e.target.value) : null,
                })
              }
              tabIndex={shouldBlurFields ? -1 : undefined}
            />
          </StackedInput.HStack>
          <StackedInput.Combobox
            label="Manufacturer"
            placeholder="Search manufacturer"
            tabIndex={shouldBlurFields ? -1 : undefined}
            disabled={pageAtom.data.isPublishing}
            value={manufacturerValue}
            onChange={v => {
              const selectedManufacturer = getVehicleManufacturers.data?.find(
                manufacturer => manufacturer.toLowerCase() === v.toLowerCase()
              );

              if (selectedManufacturer || v === '') {
                handleManufacturerChange(selectedManufacturer);
              }

              setManufacturerValue(v);
              startTransition(() =>
                setSearchManufacturerValue(selectedManufacturer ? '' : v)
              );
            }}
            onOpenChange={open => {
              const isClosing = !open;
              const userEnteredInvalidValue =
                !getVehicleManufacturers.data?.includes(manufacturerValue);

              if (isClosing && userEnteredInvalidValue) {
                setManufacturerValue(vehicle.data.manufacturer ?? '');
                setSearchManufacturerValue('');
              }
            }}
          >
            {match({
              status: getVehicleManufacturers.status,
              matchesLength: manufacturerMatches?.length,
            })
              .with({ status: P.string.regex(/^(?!success$).*$/) }, () => null)
              .with({ matchesLength: P.number.gte(1) }, () =>
                manufacturerMatches?.map(manufacturer => (
                  <StackedInput.Combobox.Item
                    key={manufacturer}
                    value={manufacturer}
                  />
                ))
              )
              .otherwise(() => (
                <Text textAlign="center" lineHeight="md" py={1.5}>
                  No matches
                </Text>
              ))}
          </StackedInput.Combobox>
          <StackedInput.TextInput
            label="Model"
            placeholder="Enter model"
            disabled={pageAtom.data.isPublishing}
            value={vehicle.data?.model ?? ''}
            onChange={e => vehicle.setData({ model: e.target.value || null })}
            tabIndex={shouldBlurFields ? -1 : undefined}
          />
          <StackedInput.Select
            label="Vehicle color"
            showOnFocus
            placeholder="Select color"
            disabled={pageAtom.data.isPublishing}
            value={vehicle.data?.color ?? ''}
            activeText={
              vehicle.data?.color ? (
                <>
                  <span
                    className={css({
                      width: 4,
                      height: 4,
                      rounded: 'full',
                    })}
                    style={{
                      backgroundColor:
                        VEHICLE_COLORS[vehicle.data.color].backgroundColor,
                      border: VEHICLE_COLORS[vehicle.data.color].border,
                    }}
                  />

                  {vehicle.data?.color}
                </>
              ) : undefined
            }
            buttonProps={{
              tabIndex: shouldBlurFields ? -1 : undefined,
            }}
            popoverProps={{
              className: css({ maxH: '17.75rem', overflow: 'auto' }),
            }}
            onChange={_v =>
              handleColorChange(_v === 'none' ? null : (_v as string))
            }
          >
            <StackedInput.Select.Item
              value="none"
              className={css({ outlineOffset: '-2px' })}
            >
              <i className={css({ fontStyle: 'italic' })}>None</i>
            </StackedInput.Select.Item>
            {Object.entries(VEHICLE_COLORS).map(([label, color]) => (
              <StackedInput.Select.Item
                key={label}
                value={label}
                className={css({ outlineOffset: '-2px' })}
              >
                {label}

                <span
                  className={css({
                    width: 4,
                    height: 4,
                    rounded: 'full',
                    ml: 'auto',
                  })}
                  style={{
                    backgroundColor: color.backgroundColor,
                    border: color.border,
                  }}
                />
              </StackedInput.Select.Item>
            ))}
          </StackedInput.Select>
          <StackedInput.TextInput
            label="VIN / Serial #"
            placeholder="Enter VIN / Serial #"
            disabled={pageAtom.data.isPublishing}
            value={vehicle.data?.vin_serial ?? ''}
            onChange={e =>
              vehicle.setData({ vin_serial: e.target.value || null })
            }
            tabIndex={shouldBlurFields ? -1 : undefined}
          />
          <Form.UsdotMaskedInput
            label="USDOT #"
            error={!isValidUsdot}
            disabled={pageAtom.data.isPublishing}
            value={vehicle.data?.usdot ?? ''}
            onChange={e => vehicle.setData({ usdot: e.target.value || null })}
            tabIndex={shouldBlurFields ? -1 : undefined}
          />
          <StackedInput.TextInput
            ref={mileageInputRef}
            label="Mileage"
            placeholder="Enter Mileage"
            disabled={pageAtom.data.isPublishing}
            value={
              typeof vehicle.data?.mileage === 'number'
                ? format.number(vehicle.data.mileage)
                : ''
            }
            onChange={e =>
              vehicle.setData({
                mileage:
                  e.target.value.length > 0
                    ? Number(e.target.value.replace(/,/g, ''))
                    : null,
              })
            }
            tabIndex={shouldBlurFields ? -1 : undefined}
          />
        </StackedInput>

        <Flex
          direction="column"
          gap={2}
          mt={2}
          css={{ _empty: { display: 'none' } }}
        >
          {step3Atom.data.shouldValidateFields && !isValidType && (
            <ErrorMessage>Please select a vehicle type</ErrorMessage>
          )}
          {!isValidYear && (
            <ErrorMessage>Please enter a valid year</ErrorMessage>
          )}
          {!isValidUsdot && (
            <ErrorMessage>Please enter a valid USDOT #</ErrorMessage>
          )}
        </Flex>

        <Flex mt={2.3}>
          {pageAtom.data.focusedSection?.includes('vehicle_creation') && (
            <Flex ml="auto" gap={3}>
              <Button
                variant="secondary"
                size="sm"
                tabIndex={shouldBlurFields ? -1 : undefined}
                disabled={postVehicle.isLoading}
                onClick={onCancelCreation}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                tabIndex={shouldBlurFields ? -1 : undefined}
                disabled={postVehicle.isLoading}
                loading={postVehicle.isLoading}
                onClick={handleCreation}
              >
                Add vehicle
              </Button>
            </Flex>
          )}

          {pageAtom.data.focusedSection === 'vehicle_editing' && (
            <Flex gap={3}>
              <Button
                variant="secondary"
                size="sm"
                disabled={patchVehicle.isLoading}
                onClick={onCancelEditing}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={patchVehicle.isLoading}
                loading={patchVehicle.isLoading}
                onClick={handleSaveVehicle}
              >
                Save changes
              </Button>
            </Flex>
          )}

          {(vehicles?.length ?? 0) > 1 &&
            !pageAtom.data.focusedSection?.includes('vehicle_creation') && (
              <Button
                variant="secondary"
                danger
                size="sm"
                ml="auto"
                tabIndex={
                  shouldBlurSection &&
                  pageAtom.data.focusedSection !== 'vehicle_editing'
                    ? -1
                    : undefined
                }
                disabled={
                  (patchVehicle.isLoading &&
                    pageAtom.data.focusedSection === 'vehicle_editing') ||
                  pageAtom.data.isPublishing
                }
                onClick={() => setIsDeleteVehicleModalOpen(true)}
              >
                Delete vehicle
              </Button>
            )}
        </Flex>
      </Box>

      <Modal
        open={isDeleteVehicleModalOpen}
        unmountOnHide
        hideOnEscape={!deleteVehicle.isLoading}
        hideOnInteractOutside={!deleteVehicle.isLoading}
        onClose={() => setIsDeleteVehicleModalOpen(false)}
      >
        <Modal.Heading>Delete this vehicle?</Modal.Heading>
        <Modal.Description>
          Any assigned services
          {jobWorkflowStatus === 'published' ? ' and parts' : ''} will also be
          deleted with this vehicle.
        </Modal.Description>

        <Flex justify="flex-end" gap={2} mt={3}>
          <Modal.Dismiss disabled={deleteVehicle.isLoading}>
            Cancel
          </Modal.Dismiss>
          <Button
            size="sm"
            danger
            disabled={deleteVehicle.isLoading}
            loading={deleteVehicle.isLoading}
            onClick={handleDeleteVehicle}
          >
            Delete
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
