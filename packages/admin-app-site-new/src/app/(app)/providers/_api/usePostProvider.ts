import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

import type { Provider } from '../_types';

type PostProviderAPIResponse = Provider;

async function postProvider(payload: PostProviderPayload) {
  const response = await api.post<PostProviderAPIResponse>(
    'providers',
    payload
  );

  return response.data;
}

type PostProviderPayload = Pick<
  Provider,
  'firstname' | 'lastname' | 'phone'
> & {
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
};

type UsePostProviderOptions = {
  onSuccess?: (data: Provider) => void;
  onError?: (error: unknown) => void;
};

export function usePostProvider({
  onSuccess,
  onError,
}: UsePostProviderOptions = {}) {
  return useMutation({
    mutationFn: postProvider,
    onSuccess,
    onError,
  });
}
