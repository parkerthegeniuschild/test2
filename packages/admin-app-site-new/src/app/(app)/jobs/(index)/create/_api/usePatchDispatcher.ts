import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { Dispatcher } from '@/app/(app)/jobs/(index)/_types';

type PatchDispatcherPayload = Omit<Dispatcher, 'company_id'>;

type PatchDispatcherAPIResponse = Dispatcher;

async function patchDispatcher({ id, ...payload }: PatchDispatcherPayload) {
  const response = await api.patch<PatchDispatcherAPIResponse>(
    `dispatchers/${id}`,
    payload
  );

  return response.data;
}

type UsePatchDispatcherOptions = {
  onSuccess?: (data: Dispatcher) => void;
  onError?: (error: unknown) => void;
};

export function usePatchDispatcher({
  onSuccess,
  onError,
}: UsePatchDispatcherOptions = {}) {
  return useMutation({ mutationFn: patchDispatcher, onSuccess, onError });
}
