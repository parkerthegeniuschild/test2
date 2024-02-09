import { useQuery } from '@tanstack/react-query';

import { objectToQueryParams } from '@/app/(app)/_utils';

type GetPlacesParams = {
  query: string;
  sessionToken?: string;
};

export type Place = {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};

type GetPlacesAPIResponse = {
  data: Place[];
};

async function getPlaces({ query, sessionToken }: GetPlacesParams) {
  const params = objectToQueryParams({
    query: encodeURIComponent(query.trim()),
    sessionToken,
  });

  const response = await fetch(`/api/place/autocomplete?${params}`);

  const { data } = (await response.json()) as GetPlacesAPIResponse;

  return data;
}

type UseGetPlacesParams = {
  enabled?: boolean;
};

export function useGetPlaces(
  params: GetPlacesParams,
  { enabled = true }: UseGetPlacesParams = {}
) {
  return useQuery({
    queryKey: ['useGetPlaces', params],
    queryFn: () => getPlaces(params),
    enabled: !!params.query && enabled,
    keepPreviousData: !!params.query,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}
