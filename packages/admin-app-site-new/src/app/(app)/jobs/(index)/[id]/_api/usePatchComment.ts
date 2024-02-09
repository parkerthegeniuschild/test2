import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import type { Comment } from '../_types';

type PatchCommentPayload = {
  id: number;
  jobId: string;
  vehicleId: number;
  text: string;
};

type PatchCommentAPIResponse = Comment;

async function patchComment({
  id,
  jobId,
  vehicleId,
  text,
}: PatchCommentPayload) {
  const response = await api.patch<PatchCommentAPIResponse>(
    `/jobs/${jobId}/vehicles/${vehicleId}/comments/${id}`,
    { text: text.trim() }
  );

  return response.data;
}

type UsePatchCommentParams = {
  onSuccess?: (data: PatchCommentAPIResponse) => void;
  onError?: (error: unknown) => void;
};

export function usePatchComment(
  { jobId, vehicleId }: Pick<PatchCommentPayload, 'jobId' | 'vehicleId'>,
  { onSuccess, onError }: UsePatchCommentParams = {}
) {
  return useMutation({
    mutationFn(payload: Omit<PatchCommentPayload, 'jobId' | 'vehicleId'>) {
      return patchComment({ ...payload, jobId, vehicleId });
    },
    onSuccess,
    onError,
  });
}
