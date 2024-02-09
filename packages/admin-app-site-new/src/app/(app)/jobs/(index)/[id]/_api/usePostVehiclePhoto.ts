import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import type { VehiclePhoto } from '../_types';

type PostVehiclePhotoPayload = {
  jobId: string;
  vehicleId: number;
  imageBase64: string;
  imageType: string;
  onUploadProgress?: (percentage: number) => void;
};

type PostVehiclePhotoAPIResponse = VehiclePhoto;

async function postVehiclePhoto({
  jobId,
  vehicleId,
  imageBase64,
  imageType,
  onUploadProgress,
}: PostVehiclePhotoPayload) {
  const response = await api.post<PostVehiclePhotoAPIResponse>(
    `/jobs/${jobId}/vehicles/${vehicleId}/photos`,
    imageBase64.split(',')[1],
    {
      headers: {
        'Content-Encoding': 'base64',
        'Content-Type': imageType,
      },
      onUploadProgress(progressEvent) {
        if (typeof progressEvent.total === 'undefined') {
          return;
        }

        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        onUploadProgress?.(percentCompleted);
      },
    }
  );

  return response.data;
}

type UsePostVehiclePhotoParams = {
  onSuccess?: (data: VehiclePhoto) => void;
  onError?: (error: unknown) => void;
  onSettled?: () => void;
  onUploadProgress?: (percentage: number) => void;
};

export function usePostVehiclePhoto({
  onSuccess,
  onError,
  onSettled,
  onUploadProgress,
}: UsePostVehiclePhotoParams = {}) {
  return useMutation({
    mutationFn: (payload: Omit<PostVehiclePhotoPayload, 'onUploadProgress'>) =>
      postVehiclePhoto({ ...payload, onUploadProgress }),
    onSuccess,
    onError,
    onSettled,
  });
}
