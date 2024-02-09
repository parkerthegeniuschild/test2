import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type PostProviderEarningPayload = {
  jobId: string;
  description: string;
  quantity: number;
  price: number;
  providerId: number;
};

async function postProviderEarning({
  jobId,
  description,
  quantity,
  price,
  providerId,
}: PostProviderEarningPayload) {
  const response = await api.post(`/jobs/${jobId}/earnings`, {
    description: description.trim(),
    quantity,
    unit_price_cents: price * 100,
    provider_id: providerId,
  });

  return response.data;
}

type UsePostProviderEarningParams = {
  onAfterMutate?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function usePostProviderEarning({
  onAfterMutate,
  onSuccess,
  onError,
}: UsePostProviderEarningParams = {}) {
  return useMutation({
    async mutationFn(payload: PostProviderEarningPayload) {
      const data = await postProviderEarning(payload);

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
