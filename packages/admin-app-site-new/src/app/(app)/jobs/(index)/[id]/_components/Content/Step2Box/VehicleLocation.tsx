import { useEffect, useReducer, useState } from 'react';
import { flushSync } from 'react-dom';
import { useDebounce } from 'react-use';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';

import {
  type Place,
  useFetchPlaceDetails,
  useGetPlaces,
} from '@/app/(app)/_api';
import { useIsMounted } from '@/app/(app)/_hooks';
import { getZoomByLocationType } from '@/app/(app)/jobs/(index)/_components';
import {
  useFetchPlaceFromCoordinates,
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
  emitFetchLocationDetailsRequestChange,
  emitPatchJobRequestChange,
  emitVehicleLocationSelect,
  useJobMarkerDragEndListener,
} from '@/app/(app)/jobs/(index)/[id]/_events';
import { Combobox, ErrorMessage, Icon, Label, Text } from '@/components';
import { css } from '@/styled-system/css';
import { Flex } from '@/styled-system/jsx';

const initialSessionToken = nanoid();

export function VehicleLocation() {
  const shouldBlurSection = useShouldBlurSection();

  const mapAtom = useMapAtom();
  const pageAtom = usePageAtom();
  const step2Atom = useStep2Atom();

  const queryClient = useQueryClient();

  const [selectedPlace, setSelectedPlace] = useState<Omit<
    Place,
    'structured_formatting'
  > | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [debouncedAddress, setDebouncedAddress] = useState(
    step2Atom.data.address ?? ''
  );

  const [placesSessionToken, regeneratePlacesSessionToken] = useReducer(
    () => nanoid(),
    initialSessionToken
  );

  useDebounce(
    () => {
      setDebouncedAddress(step2Atom.data.address ?? '');
    },
    200,
    [step2Atom.data.address]
  );

  const getPlaces = useGetPlaces(
    {
      query: debouncedAddress,
      sessionToken: placesSessionToken,
    },
    { enabled: isDirty }
  );

  const params = useParams();
  const jobId = params.id as string;

  const getJob = useGetJob(jobId);
  const patchJob = usePatchJob(params.id as string, {
    refetchJobOnSuccess: true,
    onSuccess() {
      emitVehicleLocationSelect();

      void queryClient.invalidateQueries({
        queryKey: [useGetNearbyProviders.queryKey, { jobId }],
      });
      void queryClient.invalidateQueries({
        queryKey: [useGetNearbyProvidersCount.queryKey, { jobId }],
      });
    },
  });

  const isMounted = useIsMounted();

  const isFocusedOnADifferentSection =
    shouldBlurSection && pageAtom.data.focusedSection !== 'address';
  const isOnEditMode = pageAtom.data.focusedSection === 'address';

  const fetchPlaceDetails = useFetchPlaceDetails({
    onMutate() {
      emitFetchLocationDetailsRequestChange({ status: 'pending' });
    },
    onSuccess(data) {
      regeneratePlacesSessionToken();

      const city =
        data.address_components.find(({ types }) => types.includes('locality'))
          ?.long_name ?? null;
      const state =
        data.address_components.find(({ types }) =>
          types.includes('administrative_area_level_1')
        )?.short_name ?? null;
      const street =
        data.address_components.find(({ types }) => types.includes('route'))
          ?.short_name ?? null;
      const streetNumber =
        data.address_components.find(({ types }) =>
          types.includes('street_number')
        )?.long_name ?? null;
      const zip =
        data.address_components.find(({ types }) =>
          types.includes('postal_code')
        )?.long_name ?? null;
      const locationType = data.types?.[0] ?? null;

      mapAtom.navigateToLocation({
        longitude: data.geometry.location.lng,
        latitude: data.geometry.location.lat,
        zoom: getZoomByLocationType(locationType),
      });

      let { address } = step2Atom.data;

      if (zip) {
        const insertZipRegex = /(.*),\s*([A-Z]{2}),\s*(.+)/;
        address = address?.replace(insertZipRegex, `$1, $2 ${zip}, $3`);

        if (address) {
          setSelectedPlace(_state => ({
            place_id: _state?.place_id ?? '',
            description: address!,
          }));
          step2Atom.setAddress(address);
          setDebouncedAddress(address);
        }
      }

      step2Atom.setAddressMetadata({
        city,
        state,
        locationType,
        street,
        streetNumber,
        zip,
      });

      if (isOnEditMode) {
        return;
      }

      patchJob.mutate({
        location_latitude: data.geometry.location.lat,
        location_longitude: data.geometry.location.lng,
        location_address: address ?? null,
        location_city: city,
        location_state: state,
        location_street: street,
        location_street_number: streetNumber,
        location_zip: zip,
        location_type: locationType,
      });
    },
    onError(error) {
      emitFetchLocationDetailsRequestChange({ status: 'error', error });
    },
    onSettled() {
      emitFetchLocationDetailsRequestChange({ status: 'settled' });
    },
  });

  const fetchPlaceFromCoordinates = useFetchPlaceFromCoordinates({
    onMutate() {
      if (isOnEditMode) {
        return;
      }

      emitPatchJobRequestChange({ status: 'pending' });
    },
    onSuccess(place) {
      const city =
        place.address_components.find(({ types }) => types.includes('locality'))
          ?.long_name ?? null;
      const state =
        place.address_components.find(({ types }) =>
          types.includes('administrative_area_level_1')
        )?.short_name ?? null;
      const street =
        place.address_components.find(({ types }) => types.includes('route'))
          ?.long_name ?? null;
      const streetNumber =
        place.address_components.find(({ types }) =>
          types.includes('street_number')
        )?.long_name ?? null;
      const zip =
        place.address_components.find(({ types }) =>
          types.includes('postal_code')
        )?.long_name ?? null;
      const locationType = place.types?.[0] ?? null;

      const newDefaultZoom = getZoomByLocationType(locationType);
      const currentMapZoom = mapAtom.data.mapRef?.getZoom() ?? 0;

      if (newDefaultZoom > currentMapZoom) {
        mapAtom.navigateToLocation({
          latitude: place.latitude,
          longitude: place.longitude,
          showJobMarkerHint: false,
          mutateJobMarker: false,
          zoom: newDefaultZoom,
        });
      }

      setSelectedPlace({
        description: place.formatted_address,
        place_id: place.place_id,
      });
      step2Atom.setAddress(place.formatted_address);
      setDebouncedAddress(place.formatted_address);

      step2Atom.setAddressMetadata({
        city,
        state,
        locationType,
        street,
        streetNumber,
        zip,
      });

      if (isOnEditMode) {
        return;
      }

      patchJob.mutate({
        location_latitude: place.latitude,
        location_longitude: place.longitude,
        location_address: place.formatted_address,
        location_city: city,
        location_state: state,
        location_street: street,
        location_street_number: streetNumber,
        location_zip: zip,
        location_type: locationType,
      });
    },
  });

  useJobMarkerDragEndListener(fetchPlaceFromCoordinates.mutate);

  useEffect(() => {
    const vehicleLocationAutocomplete = document.getElementById(
      'vehicle-location-autocomplete'
    ) as HTMLInputElement | null;

    if (!vehicleLocationAutocomplete) {
      return;
    }

    const { value } = vehicleLocationAutocomplete;
    vehicleLocationAutocomplete.value = '';
    vehicleLocationAutocomplete.value = value;
    vehicleLocationAutocomplete?.focus();
  }, []);

  const shouldShowError = Boolean(
    step2Atom.data.shouldValidateFields && !step2Atom.data.address
  );

  function handleOpenChange(open: boolean) {
    if (open) {
      return;
    }

    const userHasntSelectedLocation = !selectedPlace;
    const isAddressPreviouslySelected = !!getJob.data?.location_address;

    if (userHasntSelectedLocation && !isAddressPreviouslySelected) {
      step2Atom.setAddress('');
      setDebouncedAddress('');
    }

    if (
      isAddressPreviouslySelected &&
      step2Atom.data.address !== getJob.data?.location_address &&
      userHasntSelectedLocation
    ) {
      step2Atom.setAddress(getJob.data!.location_address!);
      setDebouncedAddress(getJob.data!.location_address!);
      return;
    }

    const userEnteredInvalidAddress =
      selectedPlace && step2Atom.data.address !== selectedPlace.description;

    if (userEnteredInvalidAddress) {
      step2Atom.setAddress(selectedPlace.description);
      setDebouncedAddress(selectedPlace.description);
    }
  }

  function handleLocationSelect(place: Place) {
    if (
      place.place_id === selectedPlace?.place_id ||
      place.description === selectedPlace?.description ||
      place.description === getJob.data?.location_address
    ) {
      return;
    }

    flushSync(() => setSelectedPlace(place));
    setIsDirty(false);
    fetchPlaceDetails.mutate({
      place_id: place.place_id,
      fields: ['address_components', 'geometry', 'types'],
      sessionToken: placesSessionToken,
    });
  }

  return (
    <Flex direction="column" mt={5} gap={2}>
      <Label
        htmlFor="vehicle-location-autocomplete"
        required
        maxW="max"
        color="gray.600"
      >
        Where the vehicle is located?
      </Label>

      <Combobox
        id="vehicle-location-autocomplete"
        placeholder="Add address"
        showOnFocus={isMounted}
        tabIndex={isFocusedOnADifferentSection ? -1 : undefined}
        error={shouldShowError}
        value={step2Atom.data.address ?? ''}
        onChange={value => {
          if (value.trim() === '') {
            setDebouncedAddress('');
          }

          step2Atom.setAddress(value);
        }}
        inputProps={{ onChange: () => setIsDirty(true) }}
        onOpenChange={handleOpenChange}
      >
        {getPlaces.data?.map(place => (
          <Combobox.Item
            key={place.place_id}
            css={{ fontWeight: 'medium' }}
            value={place.description}
            active={
              place.place_id === selectedPlace?.place_id ||
              place.description === selectedPlace?.description
            }
            onClick={() => handleLocationSelect(place)}
          >
            <Icon.MarkerPin
              className={css({ flexShrink: 0, color: 'gray.300' })}
            />
            {place.description}
          </Combobox.Item>
        ))}

        {(step2Atom.data.address?.trim().length ?? 0) > 0 &&
          getPlaces.isSuccess &&
          getPlaces.data.length === 0 && (
            <Text textAlign="center" lineHeight="md" py={1.5}>
              No matches
            </Text>
          )}
      </Combobox>

      <Flex direction="column" gap={1}>
        <Text lineHeight="md">
          If address is unknown, enter a nearby location, like a city or road
          name, then drag & drop map pin to a more precise location.
        </Text>

        {shouldShowError && <ErrorMessage>Please enter address</ErrorMessage>}
      </Flex>
    </Flex>
  );
}
