import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import type { Job } from '../_types';

import { useGetJob } from './useGetJob';

type PublishJobAPIResponse = Job;

async function publishJob(id: string) {
  const response = await api.patch<PublishJobAPIResponse>(
    `/jobs/${id}/publish`
  );

  return response.data;
}

type UsePublishJobParams = {
  refetchJobOnSuccess?: boolean;
  onSuccess?: (data: PublishJobAPIResponse) => void;
  onError?: (error: unknown) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};

export function usePublishJob(
  id: string,
  {
    refetchJobOnSuccess,
    onError,
    onSuccess,
    onMutate,
    onSettled,
  }: UsePublishJobParams = {}
) {
  const getJob = useGetJob(id, { enabled: false });

  return useMutation({
    async mutationFn() {
      const data = await publishJob(id);

      if (refetchJobOnSuccess) {
        await getJob.refetch();
      }

      return data;
    },
    onError,
    onSuccess,
    onMutate,
    onSettled,
  });
}
