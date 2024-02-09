import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import { useGetJob } from './useGetJob';

type DeleteProviderFromJobPayload = {
  jobId: string;
  providerId: number;
};

async function deleteProviderFromJob({
  jobId,
  providerId,
}: DeleteProviderFromJobPayload) {
  const response = await api.delete(`/jobs/${jobId}/providers/${providerId}`);

  return response.data;
}

type UseDeleteProviderFromJobParams = {
  refetchJobOnSuccess?: boolean;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useDeleteProviderFromJob(
  jobId: string,
  {
    refetchJobOnSuccess,
    onSuccess,
    onError,
  }: UseDeleteProviderFromJobParams = {}
) {
  const getJob = useGetJob(jobId, { enabled: false });

  return useMutation({
    async mutationFn(payload: Omit<DeleteProviderFromJobPayload, 'jobId'>) {
      const data = await deleteProviderFromJob({ ...payload, jobId });

      if (refetchJobOnSuccess) {
        await getJob.refetch();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
