import { useQuery } from '@tanstack/react-query';
import { match } from 'ts-pattern';

import { format as dateFnsFormat } from '@/app/_lib/dateFns';
import { api } from '@/app/_services/api';
import { format } from '@/app/_utils';

const paymentMethodToText = {
  cash: {
    title: 'Cash',
    description: 'received by {{param}}',
  },
  credit_card: {
    title: 'Credit Card',
    description: '•••• {{param}}',
  },
  check: {
    title: 'Check',
    description: 'Check #{{param}}',
  },
  zelle: {
    title: 'Zelle',
    description: 'Confirmation #{{param}}',
  },
  cash_app: {
    title: 'Cash App',
    description: 'Identifier #{{param}}',
  },
  t_chek: {
    title: 'T-Chek',
    description: 'RS Trans #{{param}}',
  },
  comchek: {
    title: 'Comchek',
    description: 'RS Trans #{{param}}',
  },
  efs_check: {
    title: 'EFS Check',
    description: 'RS Trans #{{param}}',
  },
  discount: {
    title: 'Discount',
    description: '{{param}}',
  },
};

type GetPriceSummaryParams = {
  jobId: string;
};

type GetPriceSummaryAPIResponse = {
  balance_cents: number;
  charge: {
    charge_callout_cents: number;
    labor_hours_amount: number | null;
    labor_hours_unit_price_cents: number;
    labor_hours_unit_price_cents_total: number;
    surpassed_minimum: boolean;
    parts_price_cents_total: number;
    subtotal_price_cents: number;
    tax_price_cents: number;
    tax_rate: number;
    total_price_cents: number;
  };
  payments: {
    total_amount_paid_cents: number;
    entries: Array<{
      id: number;
      amount_cents: number;
      payment_method: keyof typeof paymentMethodToText;
      created_at: string;
      identifier: string;
      provider_id: number | null;
      provider_name: string | null;
    }>;
  };
};

async function getPriceSummary({ jobId }: GetPriceSummaryParams) {
  const response = await api.get<GetPriceSummaryAPIResponse>(
    `/jobs/${jobId}/charges`
  );

  return {
    ...response.data,
    paymentMethodToText,
    totalBalance: format.currency(response.data.balance_cents / 100),
    status:
      response.data.balance_cents <= 0
        ? ('paid' as const)
        : ('unpaid' as const),
    charge: {
      ...response.data.charge,
      laborHoursPrice: format.currency(
        response.data.charge.labor_hours_unit_price_cents / 100
      ),
      laborHoursTotalPrice: format.currency(
        response.data.charge.labor_hours_unit_price_cents_total / 100
      ),
      partsPrice: format.currency(
        response.data.charge.parts_price_cents_total / 100
      ),
      calloutPrice: format.currency(
        response.data.charge.charge_callout_cents / 100
      ),
      subtotalPrice: format.currency(
        response.data.charge.subtotal_price_cents / 100
      ),
      taxPrice: format.currency(response.data.charge.tax_price_cents / 100),
      taxPercentage: `${format.number(response.data.charge.tax_rate, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`,
      totalPrice: format.currency(response.data.charge.total_price_cents / 100),
    },
    payments: {
      ...response.data.payments,
      totalAmountPaid: format.currency(
        response.data.payments.total_amount_paid_cents / 100
      ),
      entries: response.data.payments.entries
        .sort((a, b) => a.id - b.id)
        .map(entry => ({
          ...entry,
          timestamp: dateFnsFormat(
            new Date(entry.created_at),
            'EEE, MMM d - h:mm a'
          ),
          amountPaid: format.currency(entry.amount_cents / 100),
          paymentMethodTitle:
            paymentMethodToText[
              entry.payment_method as keyof typeof paymentMethodToText
            ]?.title ?? entry.payment_method,
          paymentMethodDescription:
            paymentMethodToText[
              entry.payment_method as keyof typeof paymentMethodToText
            ]?.description.replace(
              '{{param}}',
              match(entry.payment_method as keyof typeof paymentMethodToText)
                .with('cash', () => entry.provider_name)
                .otherwise(() => entry.identifier) ?? entry.identifier
            ) ?? entry.identifier,
        })),
    },
  };
}

export type PriceSummaryParsed = Awaited<ReturnType<typeof getPriceSummary>>;

const QUERY_KEY = 'useGetPriceSummary';

type UseGetPriceSummaryParams = {
  enabled?: boolean;
};

export function useGetPriceSummary(
  params: GetPriceSummaryParams,
  { enabled }: UseGetPriceSummaryParams = {}
) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getPriceSummary(params),
    refetchInterval: 30 * 1000, // 30 seconds
    enabled,
  });
}

useGetPriceSummary.queryKey = QUERY_KEY;
