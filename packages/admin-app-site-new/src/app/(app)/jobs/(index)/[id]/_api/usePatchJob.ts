import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { Driver } from '@/app/(app)/jobs/(index)/_types';

import { emitPatchJobRequestChange } from '../_events';
import type { Job } from '../_types';

import { useGetJob } from './useGetJob';

type PatchJobPayload = Partial<Omit<Job, 'id'>> & {
  id: string;
  drivers?: Omit<Driver, 'id'>[];
};

type PatchJobAPIResponse = Partial<Omit<Job, 'id'>>;

async function patchJob({ id, ...payload }: PatchJobPayload) {
  const response = await api.patch<PatchJobAPIResponse>(`/jobs/${id}`, payload);

  return response.data;
}

type UsePatchJobParams = {
  refetchJobOnSuccess?: boolean;
  onSuccess?: (data: PatchJobAPIResponse) => void;
  onAfterMutate?: () => Promise<void>;
  onError?: (error: unknown) => void;
};

export function usePatchJob(
  id: string,
  {
    refetchJobOnSuccess,
    onSuccess,
    onAfterMutate,
    onError,
  }: UsePatchJobParams = {}
) {
  const getJob = useGetJob(id, { enabled: false });

  return useMutation({
    async mutationFn(payload: Omit<PatchJobPayload, 'id'>) {
      emitPatchJobRequestChange({ status: 'pending' });

      const data = await patchJob({ ...payload, id });

      if (refetchJobOnSuccess) {
        await getJob.refetch();
      }

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
    },
    onSuccess,
    onError(error) {
      emitPatchJobRequestChange({ status: 'error', error });
      onError?.(error);
    },
    onSettled() {
      emitPatchJobRequestChange({ status: 'settled' });
    },
  });
}
