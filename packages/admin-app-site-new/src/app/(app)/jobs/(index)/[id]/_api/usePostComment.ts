import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import type { Comment } from '../_types';

import { useGetComments } from './useGetComments';

type PostCommentPayload = {
  jobId: string;
  vehicleId: number;
  text: string;
};

type PostCommentAPIResponse = Comment;

async function postComment({ jobId, vehicleId, text }: PostCommentPayload) {
  const response = await api.post<PostCommentAPIResponse>(
    `/jobs/${jobId}/vehicles/${vehicleId}/comments`,
    { text: text.trim() }
  );

  return response.data;
}

type UsePostCommentParams = {
  refetchCommentsOnSuccess?: boolean;
  onSuccess?: (data: PostCommentAPIResponse) => void;
  onError?: (error: unknown) => void;
};

export function usePostComment(
  { jobId, vehicleId }: Pick<PostCommentPayload, 'jobId' | 'vehicleId'>,
  { refetchCommentsOnSuccess, onSuccess, onError }: UsePostCommentParams = {}
) {
  const getComments = useGetComments({ jobId, vehicleId }, { enabled: false });

  return useMutation({
    async mutationFn(payload: Omit<PostCommentPayload, 'jobId' | 'vehicleId'>) {
      const data = await postComment({ ...payload, jobId, vehicleId });

      if (refetchCommentsOnSuccess) {
        await getComments.refetch();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
