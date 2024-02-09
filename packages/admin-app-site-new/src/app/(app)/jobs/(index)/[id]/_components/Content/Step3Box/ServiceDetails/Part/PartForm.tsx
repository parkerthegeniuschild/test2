import { useState } from 'react';
import { FocusTrapRegion } from '@ariakit/react';
import { useNumberFormat } from '@react-input/number-format';
import { useQueryClient } from '@tanstack/react-query';

import { format } from '@/app/_utils';
import {
  useGetJob,
  useGetPriceSummary,
  usePatchServicePart,
  usePostServicePart,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  usePageAtom,
  useVehicleService,
  useVehicleServicePart,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import type { ServicePart } from '@/app/(app)/jobs/(index)/[id]/_types';
import { Button, ErrorMessage, StackedInput, Text, toast } from '@/components';
import { Flex } from '@/styled-system/jsx';
import { flex } from '@/styled-system/patterns';

import { ConfirmPartDeleteModal } from './ConfirmPartDeleteModal';

const MINIMUM_ACCEPTABLE_MARKUP = 10;

export interface PartFormProps {
  id: number;
  vehicleId: number;
  serviceId: number;
  part?: ServicePart;
  onSuccessfulSubmit?: () => void;
  onCancel?: () => void;
}

export function PartForm({
  id,
  serviceId,
  vehicleId,
  part,
  onSuccessfulSubmit,
  onCancel,
}: PartFormProps) {
  const jobId = useJobId();

  const pageAtom = usePageAtom();
  const vehicleService = useVehicleService({ serviceId, vehicleId });
  const vehicleServicePart = useVehicleServicePart({
    partId: id,
    serviceId,
    vehicleId,
  });

  const queryClient = useQueryClient();

  const getJob = useGetJob(jobId);

  const postServicePart = usePostServicePart({
    onSuccess(data) {
      pageAtom.setFocusedSection(null);

      vehicleService.removePart(id);
      vehicleService.addPart(data);

      getJob.updateData({
        jobVehicles: getJob.data?.jobVehicles.map(jobVehicle =>
          jobVehicle.id === vehicleId
            ? {
                ...jobVehicle,
                jobServices: jobVehicle.jobServices.map(service =>
                  service.id === serviceId
                    ? {
                        ...service,
                        jobServiceParts: [
                          ...(service.jobServiceParts ?? []),
                          data,
                        ],
                      }
                    : service
                ),
              }
            : jobVehicle
        ),
      });

      void queryClient.invalidateQueries({
        queryKey: [useGetPriceSummary.queryKey],
      });

      toast.success('Part created successfully');

      onSuccessfulSubmit?.();
    },
    onError(error) {
      toast.error(
        `Error while creating part${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });
  const patchServicePart = usePatchServicePart({
    onSuccess(data) {
      pageAtom.setFocusedSection(null);

      getJob.updateData({
        jobVehicles: getJob.data?.jobVehicles.map(jobVehicle =>
          jobVehicle.id === vehicleId
            ? {
                ...jobVehicle,
                jobServices: jobVehicle.jobServices.map(service =>
                  service.id === serviceId
                    ? {
                        ...service,
                        jobServiceParts: service.jobServiceParts?.map(_part =>
                          _part.id === id ? data : _part
                        ),
                      }
                    : service
                ),
              }
            : jobVehicle
        ),
      });

      void queryClient.invalidateQueries({
        queryKey: [useGetPriceSummary.queryKey],
      });

      toast.success('Part updated successfully');

      onSuccessfulSubmit?.();
    },
    onError(error) {
      toast.error(
        `Error while updating part${
          error instanceof Error ? `: ${error.message}` : ''
        }`
      );
    },
  });

  const quantityInputRef = useNumberFormat({
    locales: 'en',
    maximumFractionDigits: 0,
    signDisplay: 'never',
  });
  const priceInputRef = useNumberFormat({
    locales: 'en',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: 'never',
  });
  const markupInputRef = useNumberFormat({
    locales: 'en',
    maximumFractionDigits: 0,
    signDisplay: 'never',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  const isNameFilled = (vehicleServicePart.data?.name.trim().length ?? 0) > 0;

  const isQuantityFilled =
    typeof vehicleServicePart.data?.quantity === 'number';
  const isQuantityAboveMinimum = (vehicleServicePart.data?.quantity ?? 0) >= 1;

  const isPriceFilled =
    (vehicleServicePart.data?.price.toString().trim().length ?? 0) > 0;
  const isPriceAboveZero =
    Number.parseFloat(
      vehicleServicePart.data?.price.toString().replace(/,/g, '') ?? '0'
    ) > 0;

  const isMarkupFilled = typeof vehicleServicePart.data?.markup === 'number';
  const isMarkupAboveMinimum =
    (vehicleServicePart.data?.markup ?? 0) >= MINIMUM_ACCEPTABLE_MARKUP;

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setFormSubmitted(true);

    const isFormValid =
      isNameFilled &&
      isQuantityFilled &&
      isQuantityAboveMinimum &&
      isPriceFilled &&
      isPriceAboveZero &&
      isMarkupFilled &&
      isMarkupAboveMinimum;

    if (!isFormValid || !vehicleServicePart.data) {
      return;
    }

    if (pageAtom.data.focusedSection === 'part_creation') {
      postServicePart.mutate({
        jobId,
        serviceId,
        vehicleId,
        markup: vehicleServicePart.data.markup,
        name: vehicleServicePart.data.name,
        price: vehicleServicePart.data.price.toString(),
        quantity: vehicleServicePart.data.quantity,
        description: vehicleServicePart.data.description,
      });
      return;
    }

    if (pageAtom.data.focusedSection === 'part_editing') {
      patchServicePart.mutate({
        id,
        jobId,
        serviceId,
        vehicleId,
        markup: vehicleServicePart.data.markup,
        name: vehicleServicePart.data.name,
        price: vehicleServicePart.data.price.toString(),
        quantity: vehicleServicePart.data.quantity,
        description: vehicleServicePart.data.description,
      });
      return;
    }

    if (pageAtom.data.focusedSection?.includes('part_creation')) {
      pageAtom.removeFocusedSection('part_creation');

      vehicleService.removePart(id);
      vehicleService.addPart({
        id: (vehicleService.data?.jobServiceParts.at(-2)?.id ?? 1) + 1,
        markup: vehicleServicePart.data.markup,
        name: vehicleServicePart.data.name.trim(),
        price: vehicleServicePart.data.price.toString().replace(/,/g, ''),
        quantity: vehicleServicePart.data.quantity,
        description: vehicleServicePart.data.description?.trim(),
      });

      onSuccessfulSubmit?.();
      return;
    }

    pageAtom.removeFocusedSection('part_editing');

    vehicleService.addPart({
      id,
      markup: vehicleServicePart.data.markup,
      name: vehicleServicePart.data.name.trim(),
      price: vehicleServicePart.data.price.toString().replace(/,/g, ''),
      quantity: vehicleServicePart.data.quantity,
      description: vehicleServicePart.data.description?.trim(),
    });

    onSuccessfulSubmit?.();
  }

  function handleSuccessfulDelete() {
    vehicleService.removePart(id);
    pageAtom.setFocusedSection(null);

    getJob.updateData({
      jobVehicles: getJob.data?.jobVehicles.map(jobVehicle =>
        jobVehicle.id === vehicleId
          ? {
              ...jobVehicle,
              jobServices: jobVehicle.jobServices.map(service =>
                service.id === serviceId
                  ? {
                      ...service,
                      jobServiceParts: service.jobServiceParts?.filter(
                        _part => _part.id !== id
                      ),
                    }
                  : service
              ),
            }
          : jobVehicle
      ),
    });

    void queryClient.invalidateQueries({
      queryKey: [useGetPriceSummary.queryKey],
    });

    onSuccessfulSubmit?.();
  }

  function handleDelete() {
    if (pageAtom.data.focusedSection?.includes('vehicle_creation')) {
      pageAtom.removeFocusedSection('part_editing');

      vehicleService.removePart(id);

      onSuccessfulSubmit?.();

      return;
    }

    setIsConfirmDeleteModalOpen(true);
  }

  return (
    <>
      <FocusTrapRegion enabled>
        <form
          className={flex({ direction: 'column', gap: 2.3 })}
          noValidate
          onSubmit={handleFormSubmit}
        >
          <Flex direction="column" gap={2}>
            <StackedInput>
              <StackedInput.TextInput
                autoFocus
                required
                label="Part name"
                placeholder="Enter part name"
                error={formSubmitted && !isNameFilled}
                value={vehicleServicePart.data?.name ?? ''}
                onChange={e =>
                  vehicleServicePart.setData({ name: e.target.value })
                }
              />
              <StackedInput.TextInput
                label="Description"
                placeholder="Description..."
                value={vehicleServicePart.data?.description ?? ''}
                onChange={e =>
                  vehicleServicePart.setData({ description: e.target.value })
                }
              />
              <StackedInput.HStack>
                <StackedInput.TextInput
                  ref={quantityInputRef}
                  required
                  label="Qty"
                  placeholder="0"
                  error={
                    formSubmitted &&
                    (!isQuantityFilled || !isQuantityAboveMinimum)
                  }
                  value={
                    typeof vehicleServicePart.data?.quantity === 'number'
                      ? format.number(vehicleServicePart.data?.quantity)
                      : ''
                  }
                  onChange={e =>
                    vehicleServicePart.setData({
                      quantity:
                        e.target.value.length > 0
                          ? Number(e.target.value.replace(/,/g, ''))
                          : undefined,
                    })
                  }
                />
                <StackedInput.TextInput
                  ref={priceInputRef}
                  required
                  label="$"
                  placeholder="0.00"
                  error={formSubmitted && (!isPriceFilled || !isPriceAboveZero)}
                  value={vehicleServicePart.data?.price ?? ''}
                  onChange={e =>
                    vehicleServicePart.setData({ price: e.target.value })
                  }
                />
                <StackedInput.TextInput
                  ref={markupInputRef}
                  required
                  label="Markup"
                  placeholder="0"
                  error={
                    formSubmitted && (!isMarkupFilled || !isMarkupAboveMinimum)
                  }
                  value={vehicleServicePart.data?.markup ?? ''}
                  onChange={e =>
                    vehicleServicePart.setData({
                      markup: e.target.value
                        ? Number.parseInt(e.target.value.replace(/,/g, ''), 10)
                        : undefined,
                    })
                  }
                >
                  <Text
                    as="span"
                    color="gray.600"
                    ml={1}
                    transform="translateY(1px)"
                  >
                    %
                  </Text>
                </StackedInput.TextInput>
              </StackedInput.HStack>
            </StackedInput>

            {formSubmitted &&
              (!isNameFilled ||
                !isQuantityFilled ||
                !isPriceFilled ||
                !isMarkupFilled) && (
                <ErrorMessage lineHeight="lg">
                  Please enter the part info
                </ErrorMessage>
              )}

            {formSubmitted && isQuantityFilled && !isQuantityAboveMinimum && (
              <ErrorMessage lineHeight="lg">
                Quantity must be 1 or higher.
              </ErrorMessage>
            )}

            {formSubmitted && isPriceFilled && !isPriceAboveZero && (
              <ErrorMessage lineHeight="lg">
                Price must be higher than $0.
              </ErrorMessage>
            )}

            {formSubmitted && isMarkupFilled && !isMarkupAboveMinimum && (
              <ErrorMessage lineHeight="lg">
                Markup must be {MINIMUM_ACCEPTABLE_MARKUP}% or higher.
              </ErrorMessage>
            )}
          </Flex>

          {pageAtom.data.focusedSection?.includes('part_editing') && (
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={3}>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={patchServicePart.isLoading}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  disabled={patchServicePart.isLoading}
                  loading={patchServicePart.isLoading}
                >
                  Save changes
                </Button>
              </Flex>

              <Button
                size="sm"
                variant="secondary"
                danger
                disabled={patchServicePart.isLoading}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Flex>
          )}

          {pageAtom.data.focusedSection?.includes('part_creation') && (
            <Flex justify="flex-end" align="center" gap={3}>
              <Button
                size="sm"
                variant="secondary"
                disabled={postServicePart.isLoading}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                disabled={postServicePart.isLoading}
                loading={postServicePart.isLoading}
              >
                Add part
              </Button>
            </Flex>
          )}
        </form>
      </FocusTrapRegion>

      <ConfirmPartDeleteModal
        open={isConfirmDeleteModalOpen}
        partId={id}
        partName={(vehicleServicePart.data?.name || part?.name) ?? ''}
        serviceId={serviceId}
        vehicleId={vehicleId}
        onSuccessfulDelete={handleSuccessfulDelete}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
      />
    </>
  );
}
