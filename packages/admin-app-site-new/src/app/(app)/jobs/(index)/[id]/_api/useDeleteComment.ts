import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import { useGetComments } from './useGetComments';

type DeleteCommentPayload = {
  id: number;
  jobId: string;
  vehicleId: number;
};

async function deleteComment({ jobId, vehicleId, id }: DeleteCommentPayload) {
  const response = await api.delete(
    `/jobs/${jobId}/vehicles/${vehicleId}/comments/${id}`
  );

  return response.data;
}

type UseDeleteCommentParams = {
  refetchCommentsOnSuccess?: boolean;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useDeleteComment(
  { jobId, vehicleId }: Pick<DeleteCommentPayload, 'jobId' | 'vehicleId'>,
  { refetchCommentsOnSuccess, onSuccess, onError }: UseDeleteCommentParams = {}
) {
  const getComments = useGetComments({ jobId, vehicleId }, { enabled: false });

  return useMutation({
    async mutationFn(
      payload: Omit<DeleteCommentPayload, 'jobId' | 'vehicleId'>
    ) {
      const data = await deleteComment({ ...payload, jobId, vehicleId });

      if (refetchCommentsOnSuccess) {
        await getComments.refetch();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
