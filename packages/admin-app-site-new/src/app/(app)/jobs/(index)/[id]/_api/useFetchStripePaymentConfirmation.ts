import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type FetchStripePaymentConfirmationPayload = {
  jobId: string;
  paymentIntentId: string;
};

async function fetchStripePaymentConfirmation({
  jobId,
  paymentIntentId,
}: FetchStripePaymentConfirmationPayload) {
  const response = await api.get(
    `/jobs/${jobId}/stripe-payments/${paymentIntentId}`
  );

  return response.data;
}

type UseFetchStripePaymentConfirmationParams = {
  onAfterMutate?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useFetchStripePaymentConfirmation({
  onAfterMutate,
  onSuccess,
  onError,
}: UseFetchStripePaymentConfirmationParams = {}) {
  return useMutation({
    async mutationFn(payload: FetchStripePaymentConfirmationPayload) {
      const data = await fetchStripePaymentConfirmation(payload);

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
    },
    onSuccess,
    onError,
    retry: 5,
  });
}
