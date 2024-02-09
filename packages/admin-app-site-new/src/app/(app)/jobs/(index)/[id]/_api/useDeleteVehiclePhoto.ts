import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type DeleteVehiclePhotoPayload = {
  jobId: string;
  vehicleId: number;
  photoId: number;
};

async function deleteVehiclePhoto({
  jobId,
  photoId,
  vehicleId,
}: DeleteVehiclePhotoPayload) {
  const response = await api.delete(
    `/jobs/${jobId}/vehicles/${vehicleId}/photos/${photoId}`
  );

  return response.data;
}

type UseDeleteVehiclePhotoParams = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useDeleteVehiclePhoto({
  onSuccess,
  onError,
}: UseDeleteVehiclePhotoParams = {}) {
  return useMutation({
    mutationFn: deleteVehiclePhoto,
    onSuccess,
    onError,
  });
}
