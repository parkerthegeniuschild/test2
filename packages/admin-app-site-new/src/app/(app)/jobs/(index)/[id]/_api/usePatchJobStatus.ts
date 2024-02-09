import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { JobStatus } from '@/app/(app)/jobs/_types';

type PatchJobStatusPayload = {
  id: string;
  status: JobStatus;
  oldStatus?: JobStatus;
};

async function patchJobStatus({ id, status }: PatchJobStatusPayload) {
  const response = await api.patch(`/jobs/${id}/status`, { status_id: status });

  return response.data;
}

type PatchJobStatusMutationPayload = Omit<PatchJobStatusPayload, 'id'>;

type UsePatchJobStatusParams = {
  onMutate?: (data: PatchJobStatusMutationPayload) => void;
  onSuccess?: () => void;
  onError?: (error: unknown, variables: PatchJobStatusMutationPayload) => void;
};

export function usePatchJobStatus(
  jobId: string,
  { onMutate, onSuccess, onError }: UsePatchJobStatusParams = {}
) {
  return useMutation({
    mutationFn(payload: PatchJobStatusMutationPayload) {
      return patchJobStatus({ id: jobId, ...payload });
    },
    onMutate,
    onSuccess,
    onError,
  });
}
