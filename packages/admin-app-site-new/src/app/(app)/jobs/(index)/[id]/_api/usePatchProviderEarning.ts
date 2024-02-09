import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type PatchProviderEarningPayload = {
  id: number;
  jobId: string;
  description: string;
  quantity: number;
  price: number;
};

async function patchProviderEarning({
  id,
  jobId,
  description,
  quantity,
  price,
}: PatchProviderEarningPayload) {
  const response = await api.patch(`/jobs/${jobId}/earnings/${id}`, {
    description: description.trim(),
    quantity,
    unit_price_cents: price * 100,
  });

  return response.data;
}

type UsePatchProviderEarningParams = {
  onAfterMutate?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function usePatchProviderEarning({
  onAfterMutate,
  onSuccess,
  onError,
}: UsePatchProviderEarningParams = {}) {
  return useMutation({
    async mutationFn(payload: PatchProviderEarningPayload) {
      const data = await patchProviderEarning(payload);

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
