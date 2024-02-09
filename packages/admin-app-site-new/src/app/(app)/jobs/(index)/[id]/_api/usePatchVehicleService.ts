import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import { emitPatchJobRequestChange } from '../_events';
import type { VehicleService } from '../_types';

type VehicleServiceRelationsId = {
  id: number;
  jobId: string;
  vehicleId: number;
};

type PatchVehicleServicePayload = Partial<Omit<VehicleService, 'id'>> &
  VehicleServiceRelationsId;

type PatchVehicleServiceAPIResponse = VehicleService;

async function patchVehicleService({
  id,
  jobId,
  vehicleId,
  ...payload
}: PatchVehicleServicePayload) {
  const response = await api.patch<PatchVehicleServiceAPIResponse>(
    `jobs/${jobId}/vehicles/${vehicleId}/services/${id}`,
    payload
  );

  return response.data;
}

type UsePatchVehicleServiceParams = {
  onAfterMutate?: () => Promise<void>;
  onSuccess?: (data: PatchVehicleServiceAPIResponse) => void;
  onError?: (error: unknown) => void;
};

export function usePatchVehicleService(
  { id, jobId, vehicleId }: VehicleServiceRelationsId,
  { onAfterMutate, onSuccess, onError }: UsePatchVehicleServiceParams = {}
) {
  return useMutation({
    async mutationFn(
      payload: Omit<PatchVehicleServicePayload, 'id' | 'jobId' | 'vehicleId'>
    ) {
      emitPatchJobRequestChange({ status: 'pending' });

      const data = await patchVehicleService({
        ...payload,
        id,
        jobId,
        vehicleId,
      });

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
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
