import type { CreatePaymentIntentSchema } from '@gettruckup/bindings';
import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type PostPaymentIntentPayload = {
  jobId: string;
  amountCents: number;
  overpay: boolean;
};

type PostPaymentAPIResponse = CreatePaymentIntentSchema;

async function postPaymentIntent({
  amountCents,
  jobId,
  overpay,
}: PostPaymentIntentPayload) {
  const response = await api.post<PostPaymentAPIResponse>(
    `/jobs/${jobId}/payment-intent`,
    { amount_cents: amountCents, overpay }
  );

  return response.data;
}

export function usePostPaymentIntent() {
  return useMutation({
    mutationFn: postPaymentIntent,
  });
}
