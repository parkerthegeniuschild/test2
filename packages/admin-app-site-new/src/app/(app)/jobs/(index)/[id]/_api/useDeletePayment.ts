import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type DeletePaymentPayload = {
  id: number;
  jobId: string;
};

async function deletePayment({ id, jobId }: DeletePaymentPayload) {
  const response = await api.delete(`/jobs/${jobId}/charges/${id}`);

  return response.data;
}

type UseDeletePaymentParams = {
  onAfterMutate?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useDeletePayment({
  onAfterMutate,
  onSuccess,
  onError,
}: UseDeletePaymentParams = {}) {
  return useMutation({
    async mutationFn(payload: DeletePaymentPayload) {
      const data = await deletePayment(payload);

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
