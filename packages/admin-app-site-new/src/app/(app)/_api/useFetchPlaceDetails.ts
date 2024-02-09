import { useMutation } from '@tanstack/react-query';

import { objectToQueryParams } from '@/app/(app)/_utils';

type FetchPlaceDetailsParams = {
  place_id: string;
  fields?: string[];
  sessionToken?: string;
};

type FetchPlaceDetailsAPIResponse = {
  data: {
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    types: string[];
  };
};

async function fetchPlaceDetails({
  place_id,
  fields,
  sessionToken,
}: FetchPlaceDetailsParams) {
  const params = objectToQueryParams({
    place_id,
    fields: fields?.join(','),
    sessionToken,
  });

  const response = await fetch(`/api/place/details?${params}`);

  const { data } = (await response.json()) as FetchPlaceDetailsAPIResponse;

  return data;
}

type UseFetchPlaceDetailsParams = {
  onSuccess?: (data: FetchPlaceDetailsAPIResponse['data']) => void;
  onMutate?: () => void;
  onError?: (error: unknown) => void;
  onSettled?: () => void;
};

export function useFetchPlaceDetails({
  onSuccess,
  onError,
  onMutate,
  onSettled,
}: UseFetchPlaceDetailsParams = {}) {
  return useMutation({
    mutationFn: fetchPlaceDetails,
    onSuccess,
    onError,
    onMutate,
    onSettled,
  });
}
