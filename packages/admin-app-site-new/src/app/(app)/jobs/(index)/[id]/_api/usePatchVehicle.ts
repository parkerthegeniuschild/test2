import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import { emitPatchJobRequestChange } from '../_events';
import type { Vehicle } from '../_types';

type PatchVehiclePayload = Partial<Omit<Vehicle, 'id'>> & {
  id: number;
  jobId: string;
};

type PatchVehicleAPIResponse = Vehicle;

async function patchVehicle({ id, jobId, ...payload }: PatchVehiclePayload) {
  const response = await api.patch<PatchVehicleAPIResponse>(
    `jobs/${jobId}/vehicles/${id}`,
    payload
  );

  return response.data;
}

type UsePatchVehicleParams = {
  onSuccess?: (data: PatchVehicleAPIResponse) => void;
};

export function usePatchVehicle(
  jobId: string,
  { onSuccess }: UsePatchVehicleParams = {}
) {
  return useMutation({
    mutationFn(payload: Omit<PatchVehiclePayload, 'jobId'>) {
      emitPatchJobRequestChange({ status: 'pending' });

      return patchVehicle({ ...payload, jobId });
    },
    onSuccess,
    onError(error) {
      emitPatchJobRequestChange({ status: 'error', error });
    },
    onSettled() {
      emitPatchJobRequestChange({ status: 'settled' });
    },
  });
}
