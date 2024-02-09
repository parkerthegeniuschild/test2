import { useQuery } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import type { ServiceType } from '../_types';

export type ServiceTypeRecord = Record<number, { name: string }>;

type GetServiceTypesAPIResponse = {
  data: ServiceType[];
};

async function getServiceTypes() {
  const response = await api.get<GetServiceTypesAPIResponse>('services');

  return response.data.data.reduce(
    (serviceTypeObj, serviceType) => ({
      ...serviceTypeObj,
      [serviceType.id]: { name: serviceType.name },
    }),
    {} as ServiceTypeRecord
  );
}

type UseGetServiceTypesParams = {
  initialData?: ServiceTypeRecord;
};

export function useGetServiceTypes({
  initialData,
}: UseGetServiceTypesParams = {}) {
  return useQuery({
    queryKey: ['useGetServiceTypes'],
    queryFn: getServiceTypes,
    staleTime: Infinity,
    cacheTime: Infinity,
    initialData,
  });
}

useGetServiceTypes.queryFn = getServiceTypes;
