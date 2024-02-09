import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { Company } from '@/app/(app)/jobs/(index)/_types';

type PostCompanyPayload = Omit<Company, 'id'>;

type PostCompanyAPIResponse = [Company];

async function postCompany(payload: PostCompanyPayload) {
  const response = await api.post<PostCompanyAPIResponse>('companies', payload);

  return response.data[0];
}

type UsePostCompanyOptions = {
  onSuccess?: (data: Company) => void;
  onError?: (error: unknown) => void;
};

export function usePostCompany({
  onSuccess,
  onError,
}: UsePostCompanyOptions = {}) {
  return useMutation({ mutationFn: postCompany, onSuccess, onError });
}
