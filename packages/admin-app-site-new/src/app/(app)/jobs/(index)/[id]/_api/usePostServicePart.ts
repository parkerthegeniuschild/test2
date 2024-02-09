import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import type { ServicePart } from '../_types';

type PostServicePartPayload = Omit<ServicePart, 'id' | 'price'> & {
  price: string;
  jobId: string;
  vehicleId: number;
  serviceId: number;
};

type PostServicePartAPIResponse = ServicePart;

async function postServicePart({
  jobId,
  vehicleId,
  serviceId,
  ...payload
}: PostServicePartPayload) {
  const response = await api.post<PostServicePartAPIResponse>(
    `/jobs/${jobId}/vehicles/${vehicleId}/services/${serviceId}/parts`,
    {
      ...payload,
      price: payload.price.replace(/,/g, ''),
      name: payload.name.trim(),
      description: payload.description?.trim(),
    }
  );

  return response.data;
}

export const DEFAULT_SERVICE_PART_DATA: Omit<ServicePart, 'id'> & {
  price: string;
} = {
  name: '',
  price: '',
  markup: 40,
  quantity: 1,
};

type UsePostServicePartParams = {
  onSuccess?: (data: PostServicePartAPIResponse) => void;
  onError?: (error: unknown) => void;
};

export function usePostServicePart({
  onSuccess,
  onError,
}: UsePostServicePartParams = {}) {
  return useMutation({
    mutationFn: postServicePart,
    onSuccess,
    onError,
  });
}
