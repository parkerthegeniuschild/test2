import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type PatchPaymentPayload = {
  id: number;
  jobId: string;
  amountCents: number;
  paymentMethod: string;
  identifier: string;
  providerId?: number | null;
};

async function patchPayment({
  id,
  amountCents,
  identifier,
  jobId,
  paymentMethod,
  providerId,
}: PatchPaymentPayload) {
  const response = await api.patch(`/jobs/${jobId}/charges/${id}`, {
    amount_cents: amountCents,
    payment_method: paymentMethod,
    identifier,
    provider_id: providerId,
  });

  return response.data;
}

type UsePatchPaymentParams = {
  onAfterMutate?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function usePatchPayment({
  onAfterMutate,
  onSuccess,
  onError,
}: UsePatchPaymentParams = {}) {
  return useMutation({
    async mutationFn(payload: PatchPaymentPayload) {
      const data = await patchPayment(payload);

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
