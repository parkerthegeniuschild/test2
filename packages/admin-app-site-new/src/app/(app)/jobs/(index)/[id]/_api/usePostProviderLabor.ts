import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type PostProviderLaborPayload = {
  jobId: string;
  service_id: number | null;
  provider_id: number;
  start_time: string;
  end_time: string | null;
};

async function postProviderLabor({
  jobId,
  service_id,
  ...payload
}: PostProviderLaborPayload) {
  const response = await api.post(`/jobs/${jobId}/timers`, {
    ...payload,
    job_vehicle_contact_service_id: service_id,
  });

  return response.data;
}

type UsePostProviderLaborParams = {
  onAfterMutate?: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function usePostProviderLabor({
  onAfterMutate,
  onSuccess,
  onError,
}: UsePostProviderLaborParams = {}) {
  return useMutation({
    async mutationFn(payload: PostProviderLaborPayload) {
      const data = await postProviderLabor(payload);

      if (onAfterMutate) {
        await onAfterMutate();
      }

      return data;
    },
    onSuccess,
    onError,
  });
}
