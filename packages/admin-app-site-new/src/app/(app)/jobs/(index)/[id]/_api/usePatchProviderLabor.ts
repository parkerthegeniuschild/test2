import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type PatchProviderLaborPayload = {
  jobId: string;
  timerId: number;
  start_time?: string | null;
  end_time?: string | null;
};

async function patchProviderLabor({
  jobId,
  timerId,
  ...payload
}: PatchProviderLaborPayload) {
  const response = await api.patch(`/jobs/${jobId}/timers/${timerId}`, payload);

  return response.data;
}

type UsePatchProviderLaborParams = {
  onAfterMutate?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function usePatchProviderLabor({
  onAfterMutate,
  onSuccess,
  onError,
}: UsePatchProviderLaborParams = {}) {
  return useMutation({
    async mutationFn(payload: PatchProviderLaborPayload) {
      const data = await patchProviderLabor(payload);

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
