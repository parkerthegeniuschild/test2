import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import type { JobRequest } from '../_types';

type CancelJobRequestPayload = {
  jobId: string;
  providerId: number;
  jobRequestId: number;
};

type CancelJobRequestAPIResponse = JobRequest;

async function cancelJobRequest({
  jobId,
  jobRequestId,
}: CancelJobRequestPayload) {
  const response = await api.patch<CancelJobRequestAPIResponse>(
    `/jobs/${jobId}/requests/${jobRequestId}`,
    { status: 'CANCELED' }
  );

  return response.data;
}

type UseCancelJobRequestParams = {
  onSuccess?: (data: CancelJobRequestAPIResponse) => void;
  onError?: (error: unknown) => void;
  onMutate?: (variables: CancelJobRequestPayload) => void;
  onSettled?: (
    data: CancelJobRequestAPIResponse | undefined,
    error: unknown,
    variables: CancelJobRequestPayload
  ) => void;
};

export function useCancelJobRequest({
  onSuccess,
  onError,
  onMutate,
  onSettled,
}: UseCancelJobRequestParams = {}) {
  return useMutation({
    mutationFn: cancelJobRequest,
    onSuccess,
    onError,
    onMutate,
    onSettled,
  });
}
