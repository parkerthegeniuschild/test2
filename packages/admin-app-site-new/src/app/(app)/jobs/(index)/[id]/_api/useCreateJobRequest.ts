import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import type { JobRequest } from '../_types';

type CreateJobRequestPayload = {
  jobId: string;
  providerId: number;
};

type CreateJobRequestAPIResponse = JobRequest;

async function createJobRequest({
  jobId,
  providerId,
}: CreateJobRequestPayload) {
  const response = await api.post<CreateJobRequestAPIResponse>(
    `/jobs/${jobId}/requests`,
    { provider_id: providerId }
  );

  return response.data;
}

type UseCreateJobRequestParams = {
  onSuccess?: (data: CreateJobRequestAPIResponse) => void;
  onError?: (error: unknown) => void;
  onMutate?: (variables: CreateJobRequestPayload) => void;
  onSettled?: (
    data: CreateJobRequestAPIResponse | undefined,
    error: unknown,
    variables: CreateJobRequestPayload
  ) => void;
};

export function useCreateJobRequest({
  onSuccess,
  onError,
  onMutate,
  onSettled,
}: UseCreateJobRequestParams = {}) {
  return useMutation({
    mutationFn: createJobRequest,
    onSuccess,
    onError,
    onMutate,
    onSettled,
  });
}
