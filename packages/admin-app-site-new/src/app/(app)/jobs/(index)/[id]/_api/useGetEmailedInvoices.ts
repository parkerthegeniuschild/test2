import type { SentInvoicesByJobIdSchema } from '@gettruckup/bindings';
import { useIsFetching, useQuery } from '@tanstack/react-query';
import type { CamelCase } from 'type-fest';

import { api } from '@/app/_services/api';
import type { OrderModel } from '@/app/_types/order';
import { format } from '@/app/_utils';
import { mountOrderObject } from '@/app/(app)/_utils';

import type { EmailedInvoiceEntry } from '../_types';

type GetEmailedInvoicesParams = {
  jobId: string;
  order?: OrderModel<CamelCase<keyof EmailedInvoiceEntry>> | null;
};

type GetEmailedInvoicesAPIResponse = SentInvoicesByJobIdSchema;

async function getEmailedInvoices({ jobId, order }: GetEmailedInvoicesParams) {
  const response = await api.get<GetEmailedInvoicesAPIResponse>(
    `/jobs/${jobId}/invoices`,
    {
      params: {
        status: 'eq:SENT',
        size: 999,
        ...mountOrderObject(order),
      },
    }
  );

  const data = response.data.data.map(entry => ({
    ...entry,
    formattedDate: format.date(new Date(entry.created_at)),
    formattedTime: new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(entry.created_at)),
  }));

  return {
    data,
    emails: Array.from(
      new Set(data.map(entry => entry.email_to).filter(Boolean))
    ),
  };
}

export type EmailedInvoiceEntryParsed = Awaited<
  ReturnType<typeof getEmailedInvoices>
>['data'][number];

const QUERY_KEY = 'useGetEmailedInvoices';

type UseGetEmailedInvoicesParams = {
  enabled?: boolean;
};

export function useGetEmailedInvoices(
  params: GetEmailedInvoicesParams,
  { enabled }: UseGetEmailedInvoicesParams = {}
) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getEmailedInvoices(params),
    refetchInterval: 60 * 1000, // 60 seconds
    enabled,
  });
}

useGetEmailedInvoices.queryKey = QUERY_KEY;

export function useIsFetchingEmailedInvoices() {
  return useIsFetching({ queryKey: [QUERY_KEY] }) > 0;
}
