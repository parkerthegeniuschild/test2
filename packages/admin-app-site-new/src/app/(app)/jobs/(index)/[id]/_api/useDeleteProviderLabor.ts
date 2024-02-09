import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type DeleteProviderLaborPayload = {
  jobId: string;
  timerId: number;
};

async function deleteProviderLabor({
  jobId,
  timerId,
}: DeleteProviderLaborPayload) {
  const response = await api.delete(`/jobs/${jobId}/timers/${timerId}`);

  return response.data;
}

type UseDeleteProviderLaborParams = {
  onAfterMutate?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useDeleteProviderLabor({
  onAfterMutate,
  onSuccess,
  onError,
}: UseDeleteProviderLaborParams = {}) {
  return useMutation({
    async mutationFn(payload: DeleteProviderLaborPayload) {
      const data = await deleteProviderLabor(payload);

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
