import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/_services/api';

type FetchInvoicePreviewPayload = {
  jobId: string;
};

type FetchInvoicePreviewAPIResponse = {
  invoice_base_64: string;
};

async function fetchInvoicePreview({ jobId }: FetchInvoicePreviewPayload) {
  const response = await api.post<FetchInvoicePreviewAPIResponse>(
    'invoices/preview',
    { job_id: Number(jobId) }
  );

  return response.data;
}

type UseFetchInvoicePreviewParams = {
  onSuccess?: (data: FetchInvoicePreviewAPIResponse) => void;
  onError?: (error: unknown) => void;
};

export function useFetchInvoicePreview({
  onSuccess,
  onError,
}: UseFetchInvoicePreviewParams = {}) {
  return useMutation({
    mutationFn: fetchInvoicePreview,
    onSuccess,
    onError,
  });
}
