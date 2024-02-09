import { useMutation } from '@tanstack/react-query';

import type { Coordinate } from '@/app/(app)/jobs/(index)/[id]/_types';

import { emitFetchPlaceFromCoordinatesRequestChange } from '../_events';

type FetchPlaceFromCoordinatesAPIResponse = {
  data: {
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    formatted_address: string;
    place_id: string;
    types: string[];
  };
};

async function fetchPlaceFromCoordinates({ latitude, longitude }: Coordinate) {
  const response = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`);

  const { data } =
    (await response.json()) as FetchPlaceFromCoordinatesAPIResponse;

  return {
    ...data,
    latitude,
    longitude,
  };
}

type FetchPlaceFromCoordinatesParsedResponse = Awaited<
  ReturnType<typeof fetchPlaceFromCoordinates>
>;

type UseFetchPlaceFromCoordinatesParams = {
  onMutate?: () => void;
  onSuccess?: (data: FetchPlaceFromCoordinatesParsedResponse) => void;
};

export function useFetchPlaceFromCoordinates({
  onSuccess,
  onMutate,
}: UseFetchPlaceFromCoordinatesParams = {}) {
  return useMutation({
    mutationFn: (payload: Coordinate) => {
      emitFetchPlaceFromCoordinatesRequestChange({ status: 'pending' });

      return fetchPlaceFromCoordinates(payload);
    },
    onSuccess,
    onError(error) {
      emitFetchPlaceFromCoordinatesRequestChange({ status: 'error', error });
    },
    onSettled() {
      emitFetchPlaceFromCoordinatesRequestChange({ status: 'settled' });
    },
    onMutate,
  });
}
