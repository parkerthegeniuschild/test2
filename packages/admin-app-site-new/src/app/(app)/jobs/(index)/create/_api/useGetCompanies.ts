import { useQuery } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import type { Company } from '@/app/(app)/jobs/(index)/_types';

type GetCompaniesAPIResponse = {
  data: Company[];
};

type GetCompaniesParams = {
  name?: string;
};

async function getCompanies({ name }: GetCompaniesParams) {
  const response = await api.get<GetCompaniesAPIResponse>('companies', {
    params: {
      joins: 'completedJobsCount',
      sort: 'completedJobsCount',
      order: 'desc',
      size: 10,
      ...(name?.trim() ? { name: `ilike:%${name.trim()}%` } : {}),
    },
  });

  return response.data.data;
}

const QUERY_KEY = 'useGetCompanies';

export function useGetCompanies(params: GetCompaniesParams) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getCompanies(params),
  });
}

useGetCompanies.queryKey = QUERY_KEY;
