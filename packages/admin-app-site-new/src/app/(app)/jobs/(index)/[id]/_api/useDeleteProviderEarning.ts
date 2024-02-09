import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type DeleteProviderEarningPayload = {
  id: number;
  jobId: string;
};

async function deleteProviderEarning({
  id,
  jobId,
}: DeleteProviderEarningPayload) {
  const response = await api.delete(`/jobs/${jobId}/earnings/${id}`);

  return response.data;
}

type UseDeleteProviderEarningParams = {
  onAfterMutate?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useDeleteProviderEarning({
  onAfterMutate,
  onSuccess,
  onError,
}: UseDeleteProviderEarningParams = {}) {
  return useMutation({
    async mutationFn(payload: DeleteProviderEarningPayload) {
      const data = await deleteProviderEarning(payload);

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
