import { useQuery } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type GetTimezoneAPIResponse = {
  tz: string;
};

type GetTimezoneParams = {
  lat: number;
  lng: number;
};

async function getTimezone({ lat, lng }: GetTimezoneParams) {
  const response = await api.get<GetTimezoneAPIResponse>('tz', {
    params: { lat, lng },
  });

  const [, abbreviation] = new Intl.DateTimeFormat('en-US', {
    timeZone: response.data.tz,
    timeZoneName: 'short',
  })
    .format(new Date())
    .split(', ');

  return { ...response.data, abbreviation };
}

export type GetTimezoneParsedResponse = Awaited<ReturnType<typeof getTimezone>>;

type UseGetTimezoneParams = {
  initialData?: GetTimezoneParsedResponse;
};

export function useGetTimezone(
  params: Partial<GetTimezoneParams>,
  { initialData }: UseGetTimezoneParams = {}
) {
  return useQuery({
    queryKey: ['useGetTimezone', params],
    queryFn: () => getTimezone(params as GetTimezoneParams),
    enabled: typeof params.lat === 'number' && typeof params.lng === 'number',
    initialData,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}

useGetTimezone.queryFn = getTimezone;
