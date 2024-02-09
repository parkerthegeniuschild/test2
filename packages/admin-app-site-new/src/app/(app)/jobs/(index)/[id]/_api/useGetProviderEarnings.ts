import { useQuery } from '@tanstack/react-query';

import { api } from '@/app/_services/api';
import { format } from '@/app/_utils';

type GetProviderEarningsParams = {
  jobId: string;
};

type GetProviderEarningsAPIResponse = {
  per_hour_rate_cents: number;
  per_hour_amount: number;
  per_hour_rate_total_cents: number;
  callout_rate_cents: number;
  items_total_price_cents: number;
  items: Array<{
    id: number;
    description: string;
    quantity: string;
    total_price_cents: number;
    unit_price_cents: number;
  }>;
};

async function getProviderEarnings({ jobId }: GetProviderEarningsParams) {
  const response = await api.get<GetProviderEarningsAPIResponse>(
    `/jobs/${jobId}/earnings`
  );

  const perHourRateTotal = response.data.per_hour_rate_total_cents / 100;
  const calloutRate = response.data.callout_rate_cents / 100;

  return {
    ...response.data,
    perHourPrice: format.currency(response.data.per_hour_rate_cents / 100),
    perHourTotalPrice: format.currency(perHourRateTotal),
    calloutPrice: format.currency(calloutRate),
    totalPrice: format.currency(
      perHourRateTotal +
        calloutRate +
        response.data.items_total_price_cents / 100
    ),
    items: response.data.items
      .sort((a, b) => a.id - b.id)
      .map(item => ({
        ...item,
        quantity: Number(item.quantity),
        totalPrice: format.currency(item.total_price_cents / 100),
        unitPrice: format.currency(item.unit_price_cents / 100),
      })),
  };
}

type UseGetProviderEarningsParams = {
  enabled?: boolean;
};

export function useGetProviderEarnings(
  params: GetProviderEarningsParams,
  { enabled }: UseGetProviderEarningsParams = {}
) {
  return useQuery({
    queryKey: ['useGetProviderEarnings', params],
    queryFn: () => getProviderEarnings(params),
    refetchInterval: 30 * 1000, // 30 seconds
    enabled,
  });
}
