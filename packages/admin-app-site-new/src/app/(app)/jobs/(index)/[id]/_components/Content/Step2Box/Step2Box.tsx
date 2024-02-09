import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FocusTrapRegion } from '@ariakit/react';
import { useQueryClient } from '@tanstack/react-query';

import { getZoomByLocationType, S } from '@/app/(app)/jobs/(index)/_components';
import {
  useGetJob,
  useGetNearbyProviders,
  useGetNearbyProvidersCount,
  usePatchJob,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import {
  useMapAtom,
  usePageAtom,
  useShouldBlurSection,
  useStep2Atom,
} from '@/app/(app)/jobs/(index)/[id]/_atoms';
import {
  useFetchLocationDetailsRequestChangeListener,
  useFetchPlaceFromCoordinatesRequestChangeListener,
} from '@/app/(app)/jobs/(index)/[id]/_events';
import { Button, Heading, toast } from '@/components';
import { Flex } from '@/styled-system/jsx';

import { LocationDetails } from './LocationDetails';
import { ServiceTime } from './ServiceTime';
import { Step2Showcase } from './Step2Showcase';
import { VehicleLocation } from './VehicleLocation';

export function Step2Box() {
  const params = useParams();
  const jobId = params.id as string;

  const pageAtom = usePageAtom();
  const mapAtom = useMapAtom();
  const step2Atom = useStep2Atom();

  const queryClient = useQueryClient();

  const [isRetrievingGoogleData, setIsRetrievingGoogleData] = useState(false);

  useFetchLocationDetailsRequestChangeListener(({ status }) =>
    setIsRetrievingGoogleData(status === 'pending')
  );
  useFetchPlaceFromCoordinatesRequestChangeListener(({ status }) =>
    setIsRetrievingGoogleData(status === 'pending')
  );

  const getJob = useGetJob(jobId);

  const patchJob = usePatchJob(jobId, {
    refetchJobOnSuccess: true,
    onSuccess() {
      mapAtom.hideJobMarkerHint();
      pageAtom.setFocusedSection(null);
      step2Atom.setShouldValidateFields(false);

      void queryClient.invalidateQueries({
        queryKey: [useGetNearbyProviders.queryKey, { jobId }],
      });
      void queryClient.invalidateQueries({
        queryKey: [useGetNearbyProvidersCount.queryKey, { jobId }],
      });

      toast.success('Location data successfully updated');
    },
  });

  const shouldBlurSection =
    useShouldBlurSection() && pageAtom.data.focusedSection !== 'address';

  const isOnADifferentStep = pageAtom.data.currentStep !== 2;

  function handleCancelStep2Edit() {
    const hasChangedCoordinates =
      getJob.data?.location_latitude !==
        mapAtom.data.jobMarkerLocation?.latitude ||
      getJob.data?.location_longitude !==
        mapAtom.data.jobMarkerLocation?.longitude;

    if (hasChangedCoordinates) {
      mapAtom.navigateToLocation({
        latitude: getJob.data!.location_latitude!,
        longitude: getJob.data!.location_longitude!,
        showJobMarkerHint: false,
        zoom: getZoomByLocationType(getJob.data?.location_type),
      });
    }

    mapAtom.hideJobMarkerHint();
    pageAtom.setFocusedSection(null);
  }

  function handleSaveStep2Data() {
    step2Atom.setShouldValidateFields(true);

    const isAllStep2FieldsFilled =
      step2Atom.data.address && step2Atom.data.locationDetails;

    if (!isAllStep2FieldsFilled) {
      return;
    }

    patchJob.mutate({
      location_address: step2Atom.data.address,
      location_latitude: mapAtom.data.jobMarkerLocation?.latitude,
      location_longitude: mapAtom.data.jobMarkerLocation?.longitude,
      location_city: step2Atom.data.city ?? null,
      location_state: step2Atom.data.state ?? null,
      location_street: step2Atom.data.street ?? null,
      location_street_number: step2Atom.data.streetNumber ?? null,
      location_zip: step2Atom.data.zip ?? null,
      location_notes: step2Atom.data.locationNotes?.trim() ?? '',
      location_details: step2Atom.data.locationDetails,
      location_type: step2Atom.data.locationType ?? null,
    });
  }

  if (isOnADifferentStep && pageAtom.data.focusedSection !== 'address') {
    return <Step2Showcase />;
  }

  return (
    <FocusTrapRegion
      render={
        <Flex
          direction="column"
          px="var(--content-padding-x)"
          py={5}
          css={shouldBlurSection ? S.blurredStyles.raw() : {}}
        />
      }
      enabled={isOnADifferentStep}
    >
      <Flex
        align="center"
        justify="space-between"
        w="100%"
        mt={isOnADifferentStep ? -2 : undefined}
      >
        <Heading as="h2" fontSize="md" fontWeight="semibold">
          {isOnADifferentStep ? 'Edit location' : 'Add address & schedule'}
        </Heading>

        {isOnADifferentStep && (
          <Flex gap={3}>
            <Button
              variant="secondary"
              size="sm"
              disabled={patchJob.isLoading || isRetrievingGoogleData}
              onClick={handleCancelStep2Edit}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={patchJob.isLoading || isRetrievingGoogleData}
              loading={patchJob.isLoading}
              onClick={handleSaveStep2Data}
            >
              Save
            </Button>
          </Flex>
        )}
      </Flex>

      <VehicleLocation />

      <LocationDetails />

      {!isOnADifferentStep && <ServiceTime />}
    </FocusTrapRegion>
  );
}
