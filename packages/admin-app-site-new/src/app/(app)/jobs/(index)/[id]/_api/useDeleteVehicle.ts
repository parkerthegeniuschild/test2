import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import { emitPatchJobRequestChange } from '../_events';

type DeleteVehiclePayload = {
  id: number;
  jobId: string;
};

function deleteVehicle({ id, jobId }: DeleteVehiclePayload) {
  return api.delete(`jobs/${jobId}/vehicles/${id}`);
}

type UseDeleteVehicleParams = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useDeleteVehicle(
  jobId: string,
  { onError, onSuccess }: UseDeleteVehicleParams = {}
) {
  return useMutation({
    mutationFn(payload: Omit<DeleteVehiclePayload, 'jobId'>) {
      emitPatchJobRequestChange({ status: 'pending' });

      return deleteVehicle({ ...payload, jobId });
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
