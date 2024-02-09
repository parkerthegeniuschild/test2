import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import { emitPatchJobRequestChange } from '../_events';
import type { ServicePart, Vehicle, VehicleService } from '../_types';

import { useGetJob } from './useGetJob';

type PostVehiclePayload = Partial<Omit<Vehicle, 'id'>> & {
  jobId: string;
  services?: Array<
    Omit<VehicleService, 'id'> & {
      parts: Array<Omit<ServicePart, 'id'>>;
    }
  >;
};

type PostVehicleAPIResponse = Vehicle;

export const DEFAULT_VEHICLE_DATA: Omit<PostVehiclePayload, 'jobId'> = {};

async function postVehicle({ jobId, ...payload }: PostVehiclePayload) {
  const response = await api.post<PostVehicleAPIResponse>(
    `jobs/${jobId}/vehicles`,
    payload
  );

  return response.data;
}

type UsePostVehicleParams = {
  refetchJobOnSuccess?: boolean;
  skipOnSettledEventEmit?: boolean;
  onSuccess?: (data: PostVehicleAPIResponse) => void;
  onError?: (error: unknown) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};

export function usePostVehicle(
  jobId: string,
  {
    refetchJobOnSuccess,
    skipOnSettledEventEmit,
    onSuccess,
    onError,
    onMutate,
    onSettled,
  }: UsePostVehicleParams = {}
) {
  const getJob = useGetJob(jobId, { enabled: false });

  return useMutation({
    async mutationFn(payload: Omit<PostVehiclePayload, 'jobId'>) {
      emitPatchJobRequestChange({ status: 'pending' });

      const data = await postVehicle({ ...payload, jobId });

      if (refetchJobOnSuccess) {
        await getJob.refetch();
      }

      return data;
    },
    onSuccess,
    onError(error) {
      emitPatchJobRequestChange({ status: 'error', error });
      onError?.(error);
    },
    onMutate,
    onSettled() {
      onSettled?.();

      if (skipOnSettledEventEmit) {
        return;
      }

      emitPatchJobRequestChange({ status: 'settled' });
    },
  });
}

usePostVehicle.mutationFn = postVehicle;
