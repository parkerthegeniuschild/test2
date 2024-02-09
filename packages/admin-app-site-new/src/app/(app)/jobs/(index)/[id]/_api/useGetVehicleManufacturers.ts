import { useQuery } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type GetVehicleManufacturersAPIResponse = Array<{ manufacturer: string }>;

async function getVehicleManufacturers() {
  const response = await api.get<GetVehicleManufacturersAPIResponse>(
    'vehicles/manufacturers'
  );

  return response.data.map(({ manufacturer }) => manufacturer);
}

export function useGetVehicleManufacturers() {
  return useQuery({
    queryKey: ['useGetVehicleManufacturers'],
    queryFn: getVehicleManufacturers,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}
