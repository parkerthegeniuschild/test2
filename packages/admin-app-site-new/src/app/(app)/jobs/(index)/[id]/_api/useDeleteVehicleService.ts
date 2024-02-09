import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import { emitPatchJobRequestChange } from '../_events';

type DeleteVehicleServicePayload = {
  id: number;
  jobId: string;
  vehicleId: number;
};

function deleteVehicle({ id, jobId, vehicleId }: DeleteVehicleServicePayload) {
  return api.delete(`jobs/${jobId}/vehicles/${vehicleId}/services/${id}`);
}

type UseDeleteVehicleServiceParams = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useDeleteVehicleService(
  { jobId, vehicleId }: Omit<DeleteVehicleServicePayload, 'id'>,
  { onError, onSuccess }: UseDeleteVehicleServiceParams = {}
) {
  return useMutation({
    mutationFn(
      payload: Omit<DeleteVehicleServicePayload, 'jobId' | 'vehicleId'>
    ) {
      emitPatchJobRequestChange({ status: 'pending' });

      return deleteVehicle({ ...payload, jobId, vehicleId });
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
