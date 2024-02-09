import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { Driver } from '@/app/(app)/jobs/(index)/_types';

export type PostJobPayload = {
  company_id?: number;
  dispatcher_id: number;
  drivers: Omit<Driver, 'id'>[];
  customer_ref?: string | null;
};

type PostJobAPIResponse = [{ id: number }];

async function postJob(payload: PostJobPayload) {
  const response = await api.post<PostJobAPIResponse>('jobs', payload);

  return response.data[0];
}

type UsePostJobParams = {
  onSuccess?: (data: PostJobAPIResponse[number]) => void;
  onError?: (error: unknown) => void;
};

export function usePostJob({ onSuccess, onError }: UsePostJobParams = {}) {
  return useMutation({ mutationFn: postJob, onSuccess, onError });
}
