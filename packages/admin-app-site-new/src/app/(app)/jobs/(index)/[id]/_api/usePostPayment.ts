import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type PostPaymentPayload = {
  jobId: string;
  amountCents: number;
  paymentMethod: string;
  identifier: string;
  providerId?: number | null;
};

async function postPayment({
  amountCents,
  identifier,
  jobId,
  paymentMethod,
  providerId,
}: PostPaymentPayload) {
  const response = await api.post(`/jobs/${jobId}/charges`, {
    amount_cents: amountCents,
    payment_method: paymentMethod,
    identifier,
    provider_id: providerId,
  });

  return response.data;
}

type UsePostPaymentParams = {
  onAfterMutate?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function usePostPayment({
  onAfterMutate,
  onSuccess,
  onError,
}: UsePostPaymentParams = {}) {
  return useMutation({
    async mutationFn(payload: PostPaymentPayload) {
      const data = await postPayment(payload);

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
