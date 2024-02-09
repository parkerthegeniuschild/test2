import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { Dispatcher } from '@/app/(app)/jobs/(index)/_types';

type PostDispatcherPayload = Omit<Dispatcher, 'id'>;

type PostDispatcherAPIResponse = [Dispatcher];

async function postDispatcher(payload: PostDispatcherPayload) {
  const response = await api.post<PostDispatcherAPIResponse>(
    'dispatchers',
    payload
  );

  return response.data[0];
}

type UsePostDispatcherOptions = {
  onSuccess?: (data: Dispatcher) => void;
  onError?: (error: unknown) => void;
};

export function usePostDispatcher({
  onSuccess,
  onError,
}: UsePostDispatcherOptions = {}) {
  return useMutation({ mutationFn: postDispatcher, onSuccess, onError });
}
