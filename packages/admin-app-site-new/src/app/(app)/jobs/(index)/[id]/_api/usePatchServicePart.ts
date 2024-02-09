import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import type { ServicePart } from '../_types';

type PatchServicePartPayload = Omit<ServicePart, 'price'> & {
  price: string;
  jobId: string;
  vehicleId: number;
  serviceId: number;
};

type PatchServicePartAPIResponse = ServicePart;

async function patchServicePart({
  id,
  jobId,
  vehicleId,
  serviceId,
  ...payload
}: PatchServicePartPayload) {
  const response = await api.patch<PatchServicePartAPIResponse>(
    `/jobs/${jobId}/vehicles/${vehicleId}/services/${serviceId}/parts/${id}`,
    {
      ...payload,
      price: payload.price.replace(/,/g, ''),
      name: payload.name.trim(),
      description: payload.description?.trim(),
    }
  );

  return response.data;
}

type UsePatchServicePartParams = {
  onSuccess?: (data: PatchServicePartAPIResponse) => void;
  onError?: (error: unknown) => void;
};

export function usePatchServicePart({
  onSuccess,
  onError,
}: UsePatchServicePartParams = {}) {
  return useMutation({
    mutationFn: patchServicePart,
    onSuccess,
    onError,
  });
}
