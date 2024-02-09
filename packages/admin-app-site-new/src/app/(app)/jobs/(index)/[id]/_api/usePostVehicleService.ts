import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import { emitPatchJobRequestChange } from '../_events';
import type { VehicleService } from '../_types';

type PostVehicleServicePayload = Omit<VehicleService, 'id' | 'status'> & {
  jobId: string;
  vehicleId: number;
};

type PostVehicleServiceAPIResponse = VehicleService;

async function postVehicleService({
  jobId,
  vehicleId,
  ...payload
}: PostVehicleServicePayload) {
  const response = await api.post<PostVehicleServiceAPIResponse>(
    `jobs/${jobId}/vehicles/${vehicleId}/services`,
    payload
  );

  return response.data;
}

export const DEFAULT_VEHICLE_SERVICE_DATA: Omit<
  VehicleService,
  'id' | 'service_id'
> = {
  description: '',
  status: 'READY',
};

type UsePostVehicleServiceParams = {
  onSuccess?: (data: PostVehicleServiceAPIResponse) => void;
  onError?: (error: unknown) => void;
};

export function usePostVehicleService(
  jobId: string,
  { onSuccess, onError }: UsePostVehicleServiceParams = {}
) {
  return useMutation({
    mutationFn(payload: Omit<PostVehicleServicePayload, 'jobId'>) {
      emitPatchJobRequestChange({ status: 'pending' });

      return postVehicleService({ ...payload, jobId });
    },
    onSuccess,
    onError(error) {
      emitPatchJobRequestChange({ status: 'error', error });
      onError?.(error);
    },
    onSettled() {
      emitPatchJobRequestChange({ status: 'settled' });
    },
  });
}

usePostVehicleService.mutationFn = postVehicleService;
