import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type DeleteServicePartPayload = {
  id: number;
  jobId: string;
  vehicleId: number;
  serviceId: number;
};

async function deleteServicePart({
  id,
  jobId,
  vehicleId,
  serviceId,
}: DeleteServicePartPayload) {
  const response = await api.delete(
    `/jobs/${jobId}/vehicles/${vehicleId}/services/${serviceId}/parts/${id}`
  );

  return response.data;
}

type UseDeleteServicePartParams = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useDeleteServicePart({
  onSuccess,
  onError,
}: UseDeleteServicePartParams = {}) {
  return useMutation({
    mutationFn: deleteServicePart,
    onSuccess,
    onError,
  });
}
